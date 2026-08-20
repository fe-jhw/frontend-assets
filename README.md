# Frontend Assets

React SPA 프로젝트에서 반복해서 쓰는 지침, Codex skill, 설정, 실행 가능한 코드 예제를 모은 저장소다. 특정 제품의 폴더명·도메인·API 계약을 그대로 복제하지 않고, 새 프로젝트가 실제로 필요로 하는 자산만 골라 채택한다.

## 시작 위치

- 새 프로젝트 세팅 순서: [docs/NEW-PROJECT-SETUP.md](docs/NEW-PROJECT-SETUP.md)
- 현재 전역 skill 카탈로그: [docs/GLOBAL-SKILLS.md](docs/GLOBAL-SKILLS.md)
- 이식·제외·개선 내역: [docs/ASSET-INVENTORY.md](docs/ASSET-INVENTORY.md)
- 상시 규칙 템플릿: [templates/AGENTS.react-spa.md](templates/AGENTS.react-spa.md)
- 실행 가능한 예제와 설정: [skills/frontend-feature-patterns/assets/react-spa-foundation](skills/frontend-feature-patterns/assets/react-spa-foundation)

## 저장소가 소유하는 skill

| Skill                       | 사용 시점                                                                      |
| --------------------------- | ------------------------------------------------------------------------------ |
| `frontend-feature-patterns` | URL 목록, query/API, 인증, 폼 draft, 오류·로딩 상태를 구현하거나 리팩터링할 때 |
| `frontend-code-review`      | React 프론트엔드 diff, PR, feature를 결함과 구조 품질 관점에서 리뷰할 때       |
| `frontend-verification`     | 변경 위험도에 맞는 정적 검사와 브라우저 검증 범위를 고를 때                    |
| `frontend-bundle-audit`     | production bundle, chunk, size budget을 명시적으로 진단할 때                   |
| `frontend-skill-review`     | 프로젝트의 AGENTS, references, hooks, Codex skill 품질을 평가하거나 고칠 때    |

skill은 전체 저장소를 project-local 자산으로 연결하거나, 필요한 디렉터리만 대상 프로젝트의 `.agents/skills`에 복사해서 쓴다. 관리형 전역 skill은 이 저장소로 복제하지 않는다.

## 검증

```bash
python3 skills/frontend-skill-review/scripts/check_skill_structure.py skills
for skill in skills/*; do
  python3 /path/to/skill-creator/scripts/quick_validate.py "$skill"
done
npm --prefix skills/frontend-feature-patterns/assets/react-spa-foundation run check
```

`/path/to/skill-creator`는 현재 Codex 설치의 `skill-creator` 경로로 바꾼다.
