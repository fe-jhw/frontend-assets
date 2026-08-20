#!/usr/bin/env bash
set -euo pipefail

adapter_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skill_root="$adapter_root/skills"
validator="${CODEX_SKILL_VALIDATOR:-}"

if [[ -z "$validator" ]]; then
  codex_root="${CODEX_HOME:-$HOME/.codex}"
  validator="$codex_root/skills/.system/skill-creator/scripts/quick_validate.py"
fi

if [[ ! -f "$validator" ]]; then
  echo "Codex skill validator not found. Set CODEX_SKILL_VALIDATOR to quick_validate.py." >&2
  exit 2
fi

skill_count=0

for skill_file in "$skill_root"/*/SKILL.md; do
  [[ -f "$skill_file" ]] || continue
  python3 "$validator" "$(dirname "$skill_file")"
  skill_count=$((skill_count + 1))
done

if [[ "$skill_count" -eq 0 ]]; then
  echo "No Codex skills found under $skill_root." >&2
  exit 1
fi
