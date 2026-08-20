#!/usr/bin/env bash
set -euo pipefail

skills_root="${CODEX_SKILLS_ROOT:-$HOME/.codex/skills}"

if [[ ! -d "$skills_root" ]]; then
  echo "Global skill directory not found: $skills_root" >&2
  exit 1
fi

required=(
  codex-project-bootstrap
  codex-usage
  playwright
  react
  react-best-practices
  react-component-structure
  react-hook-form
)

status=0
for skill in "${required[@]}"; do
  label="$skill"
  if [[ "$skill" == "react-best-practices" ]]; then
    label="vercel-react-best-practices (react-best-practices)"
  fi

  if [[ -f "$skills_root/$skill/SKILL.md" ]]; then
    printf 'ok      %s\n' "$label"
  else
    printf 'missing %s\n' "$label"
    status=1
  fi
done

system_skills=(
  imagegen
  openai-docs
  plugin-creator
  review-agent
  skill-creator
  skill-installer
)

for skill in "${system_skills[@]}"; do
  if [[ -f "$skills_root/.system/$skill/SKILL.md" ]]; then
    printf 'system  %s\n' "$skill"
  else
    printf 'missing .system/%s\n' "$skill"
    status=1
  fi
done

exit "$status"
