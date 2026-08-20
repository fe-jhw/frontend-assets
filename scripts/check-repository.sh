#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
example_root="$repository_root/catalog/examples/react-spa-foundation"
skill_root="$repository_root/adapters/codex/skills"
markdown_files=()

cd "$repository_root"

python3 "$repository_root/adapters/codex/scripts/check-skill-structure.py" "$skill_root"

mapfile_command=(find . -path './.git' -prune -o -path '*/node_modules' -prune -o -name '*.md' -type f -print)
while IFS= read -r markdown_file; do
  markdown_files+=("${markdown_file#./}")
done < <("${mapfile_command[@]}" | sort)

node scripts/check-markdown-links.mjs "${markdown_files[@]}"
node --check scripts/check-markdown-links.mjs
node --check catalog/scripts/report-build-assets.mjs
bash -n adapters/codex/scripts/audit-global-skills.sh
bash -n adapters/codex/scripts/check-skills.sh

npm --prefix "$example_root" run check
npm --prefix "$example_root" run build
node catalog/scripts/report-build-assets.mjs "$example_root/dist"
