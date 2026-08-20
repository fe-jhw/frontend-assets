#!/usr/bin/env python3
"""Deterministic structure and safety checks for cataloged Codex adapters."""

from __future__ import annotations

import argparse
import ast
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


ALLOWED_FRONTMATTER_KEYS = {"description", "name"}
BLOCKER = "BLOCKER"
MAJOR = "MAJOR"
MINOR = "MINOR"
PLACEHOLDER_WORDS = ("TO" + "DO", "FIX" + "ME", "T" + "BD", "PLACE" + "HOLDER", "X" + "XX")
SECRET_PATTERNS = (
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{20,}"),
    re.compile(r"BEGIN " + r".*PRIVATE" + r" KEY"),
)
DESTRUCTIVE_COMMAND_PATTERNS = ("rm -rf", "dd if=", "mkfs", "chmod 777")
TEXT_RESOURCE_SUFFIXES = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".py",
    ".sh",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}


@dataclass(frozen=True)
class Finding:
    severity: str
    path: Path
    message: str


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "targets",
        nargs="+",
        type=Path,
        help="Skill folder, SKILL.md, or root containing skill folders.",
    )
    args = parser.parse_args()

    skill_files = collect_skill_files(args.targets)
    if not skill_files:
        print("No SKILL.md files found.", file=sys.stderr)
        return 2

    findings: list[Finding] = []
    for skill_file in skill_files:
        findings.extend(check_skill(skill_file))

    if findings:
        for finding in findings:
            print(f"[{finding.severity}] {finding.path}: {finding.message}")
    else:
        print(f"OK: checked {len(skill_files)} skill(s)")

    return 1 if any(item.severity in {BLOCKER, MAJOR} for item in findings) else 0


def collect_skill_files(targets: list[Path]) -> list[Path]:
    skill_files: list[Path] = []
    for target in targets:
        if target.is_file() and target.name == "SKILL.md":
            skill_files.append(target)
        elif (target / "SKILL.md").is_file():
            skill_files.append(target / "SKILL.md")
        elif target.is_dir():
            skill_files.extend(sorted(target.glob("*/SKILL.md")))
    return sorted(set(path.resolve() for path in skill_files))


def check_skill(skill_file: Path) -> list[Finding]:
    findings: list[Finding] = []
    text = skill_file.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(text)
    if frontmatter is None:
        return [Finding(BLOCKER, skill_file, "frontmatter가 없거나 닫히지 않았습니다.")]

    values, unknown_keys, parse_error = parse_frontmatter(frontmatter)
    if parse_error:
        findings.append(Finding(BLOCKER, skill_file, parse_error))
    for key in unknown_keys:
        findings.append(Finding(MAJOR, skill_file, f"허용되지 않은 frontmatter key입니다: {key}"))

    name = values.get("name", "")
    description = values.get("description", "")
    folder_name = skill_file.parent.name
    if not re.fullmatch(r"[a-z0-9-]{1,64}", name):
        findings.append(Finding(BLOCKER, skill_file, "name은 64자 이하 kebab-case여야 합니다."))
    if name and name != folder_name:
        findings.append(Finding(BLOCKER, skill_file, f"name과 폴더명이 다릅니다: {name} != {folder_name}"))
    if not description or len(description) > 1024:
        findings.append(Finding(BLOCKER, skill_file, "description은 1-1024자여야 합니다."))
    if re.search(r"<[A-Za-z][^>]*>", description):
        findings.append(Finding(BLOCKER, skill_file, "description에 XML/HTML 태그가 있습니다."))
    if len(body.splitlines()) > 500:
        findings.append(Finding(MINOR, skill_file, "SKILL.md body가 500줄을 넘습니다."))
    if (skill_file.parent / "README.md").exists():
        findings.append(Finding(MINOR, skill_file.parent / "README.md", "skill 폴더 안 README.md는 두지 않습니다."))

    check_placeholder_words(skill_file, body, findings)
    if "$ARGUMENTS" in body:
        findings.append(Finding(MINOR, skill_file, "정의되지 않은 $ARGUMENTS를 사용합니다."))
    check_secrets(skill_file, text, findings)
    check_destructive_commands(skill_file, body, findings)
    check_markdown_links(skill_file, text, findings)
    check_references(skill_file.parent, findings)
    check_assets(skill_file.parent, findings)
    check_agent_metadata(skill_file.parent, name, findings)
    check_scripts(skill_file.parent, findings)
    return findings


def split_frontmatter(text: str) -> tuple[str | None, str]:
    if not text.startswith("---\n"):
        return None, text
    marker = "\n---\n"
    closing = text.find(marker, 4)
    if closing < 0:
        return None, text
    return text[4:closing], text[closing + len(marker) :]


def parse_frontmatter(frontmatter: str) -> tuple[dict[str, str], list[str], str | None]:
    try:
        import yaml  # type: ignore[import-not-found]
    except Exception:
        yaml = None

    if yaml is not None:
        try:
            parsed = yaml.safe_load(frontmatter)
        except Exception as exc:
            return {}, [], f"YAML frontmatter를 파싱할 수 없습니다: {exc}"
        if not isinstance(parsed, dict):
            return {}, [], "YAML frontmatter는 mapping이어야 합니다."
        values = {str(key): str(value) for key, value in parsed.items() if value is not None}
        return values, [key for key in values if key not in ALLOWED_FRONTMATTER_KEYS], None

    values: dict[str, str] = {}
    unknown_keys: list[str] = []
    for line in frontmatter.splitlines():
        if not line.strip() or line.startswith((" ", "-")):
            continue
        key, separator, raw_value = line.partition(":")
        if not separator:
            unknown_keys.append(line.strip())
            continue
        key = key.strip()
        if key not in ALLOWED_FRONTMATTER_KEYS:
            unknown_keys.append(key)
        values[key] = strip_yaml_scalar(raw_value.strip())
    return values, unknown_keys, None


def strip_yaml_scalar(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def check_placeholder_words(path: Path, text: str, findings: list[Finding]) -> None:
    pattern = re.compile(r"\b(" + "|".join(re.escape(word) for word in PLACEHOLDER_WORDS) + r")\b")
    for line in text.splitlines():
        if "미완성 marker" in line.lower():
            continue
        if pattern.search(line):
            findings.append(Finding(MINOR, path, "미완성 marker가 있습니다."))
            return


def check_secrets(path: Path, text: str, findings: list[Finding]) -> None:
    if path.name == "check-skill-structure.py":
        text = "\n".join(
            line for line in text.splitlines() if "SECRET_PATTERNS" not in line and "re.compile" not in line
        )
    for pattern in SECRET_PATTERNS:
        if pattern.search(text):
            findings.append(Finding(BLOCKER, path, "secret 또는 credential처럼 보이는 문자열이 있습니다."))
            return


def check_markdown_links(path: Path, text: str, findings: list[Finding]) -> None:
    for match in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", text):
        raw_target = match.group(1).strip().removeprefix("<").removesuffix(">")
        file_target = raw_target.split("#", 1)[0]
        if not file_target or re.match(r"^(?:https?:|mailto:)", file_target, re.IGNORECASE):
            continue
        target = (path.parent / file_target).resolve()
        if not target.exists():
            findings.append(Finding(MINOR, path, f"존재하지 않는 local link입니다: {raw_target}"))


def check_destructive_commands(path: Path, text: str, findings: list[Finding]) -> None:
    if path.name == "check-skill-structure.py":
        return
    lowered = text.lower()
    for pattern in DESTRUCTIVE_COMMAND_PATTERNS:
        if pattern in lowered:
            findings.append(Finding(BLOCKER, path, f"파괴적 명령 패턴이 있습니다: {pattern}"))


def check_references(skill_dir: Path, findings: list[Finding]) -> None:
    references_dir = skill_dir / "references"
    if not references_dir.is_dir():
        return
    for path in sorted(references_dir.rglob("*")):
        if not path.is_file():
            continue
        if path.parent != references_dir:
            findings.append(Finding(MAJOR, path, "references는 한 단계 깊이로만 둡니다."))
        if path.suffix.lower() in {".md", ".txt", ".yaml", ".yml", ".json"}:
            text = path.read_text(encoding="utf-8", errors="ignore")
            check_placeholder_words(path, text, findings)
            check_secrets(path, text, findings)
            if path.suffix.lower() == ".md":
                check_markdown_links(path, text, findings)


def check_assets(skill_dir: Path, findings: list[Finding]) -> None:
    assets_dir = skill_dir / "assets"
    if not assets_dir.is_dir():
        return
    for path in sorted(assets_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_RESOURCE_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        check_placeholder_words(path, text, findings)
        check_secrets(path, text, findings)
        check_destructive_commands(path, text, findings)
        if path.suffix.lower() == ".md":
            check_markdown_links(path, text, findings)


def check_agent_metadata(skill_dir: Path, name: str, findings: list[Finding]) -> None:
    openai_yaml = skill_dir / "agents" / "openai.yaml"
    if not openai_yaml.is_file():
        return
    text = openai_yaml.read_text(encoding="utf-8", errors="ignore")
    check_placeholder_words(openai_yaml, text, findings)
    check_secrets(openai_yaml, text, findings)
    try:
        import yaml  # type: ignore[import-not-found]
    except Exception:
        yaml = None

    if yaml is not None:
        try:
            parsed = yaml.safe_load(text)
        except Exception as exc:
            findings.append(Finding(MAJOR, openai_yaml, f"YAML을 파싱할 수 없습니다: {exc}"))
            parsed = None
        if parsed is not None and not isinstance(parsed, dict):
            findings.append(Finding(MAJOR, openai_yaml, "openai.yaml은 mapping이어야 합니다."))
        elif isinstance(parsed, dict) and not isinstance(parsed.get("interface"), dict):
            findings.append(Finding(MAJOR, openai_yaml, "interface mapping이 없습니다."))
    elif not re.search(r"(?m)^interface:\s*$", text):
        findings.append(Finding(MAJOR, openai_yaml, "interface mapping이 없습니다."))
    if name and f"${name}" not in text:
        findings.append(Finding(MINOR, openai_yaml, f"default prompt에 ${name} 호출명이 없습니다."))


def check_scripts(skill_dir: Path, findings: list[Finding]) -> None:
    scripts_dir = skill_dir / "scripts"
    if not scripts_dir.is_dir():
        return
    for script in sorted(scripts_dir.rglob("*")):
        if not script.is_file() or "__pycache__" in script.parts or script.suffix in {".pyc", ".pyo"}:
            continue
        text = script.read_text(encoding="utf-8", errors="ignore")
        check_placeholder_words(script, text, findings)
        check_secrets(script, text, findings)
        check_destructive_commands(script, text, findings)
        check_script_syntax(script, findings)


def check_script_syntax(script: Path, findings: list[Finding]) -> None:
    if script.suffix == ".py":
        try:
            ast.parse(script.read_text(encoding="utf-8"))
        except SyntaxError as exc:
            findings.append(Finding(MAJOR, script, f"Python syntax 오류: {exc.msg}"))
        return
    if script.suffix in {".sh", ".bash"}:
        result = subprocess.run(["bash", "-n", str(script)], check=False, capture_output=True, text=True)
        if result.returncode != 0:
            message = result.stderr.strip() or "bash syntax 검사 실패"
            findings.append(Finding(MAJOR, script, f"Shell syntax 오류: {message}"))
    if script.suffix in {".js", ".mjs", ".cjs"}:
        result = subprocess.run(["node", "--check", str(script)], check=False, capture_output=True, text=True)
        if result.returncode != 0:
            message = result.stderr.strip() or "node syntax 검사 실패"
            findings.append(Finding(MAJOR, script, f"JavaScript syntax 오류: {message}"))


if __name__ == "__main__":
    raise SystemExit(main())
