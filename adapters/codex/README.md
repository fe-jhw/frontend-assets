# Codex Adapter

이 디렉터리는 Codex 전용 trigger, workflow routing과 UI metadata를 소유한다. frontend 지식과 실행 예제는 루트 `catalog/`를 참조한다.

## 구성

- `skills/`: catalog를 작업별로 라우팅하는 Codex skill
- `GLOBAL-SKILLS.md`: 외부 관리 skill 카탈로그
- `scripts/`: 현재 Codex 설치 상태와 adapter 구조 진단

## Skills

| Skill               | 역할                                                          |
| ------------------- | ------------------------------------------------------------- |
| `url-list-state`    | 공유·복원 가능한 URL 소유 목록 상태와 pagination              |
| `local-pagination`  | modal·tab 등 일시적 목록의 component-local pagination         |
| `query-api`         | query key, runtime parsing, API adapter와 mutation cache 경계 |
| `auth-client`       | token store, concurrent 401 refresh와 session race 경계       |
| `draft-lifecycle`   | async form reset, dirty draft 보존과 이탈 보호                 |
| `ui-states`         | loading, empty, refetch error와 render boundary surface       |
| `tooling-baseline`  | ESLint, Prettier, TypeScript, Vite와 Vitest baseline          |
| `bundle-audit`      | catalog의 dependency-free reporter를 포함한 bundle 진단       |

구현 pattern은 catch-all skill 하나로 묶지 않는다. 자동 선택에 사용되는 description이 실제 사용자 의도 하나를 가리키도록 URL 목록, local pagination, query/API, auth, draft lifecycle, UI state와 tooling을 각각 독립 trigger로 유지한다.

일반 React 코드 리뷰, 변경 검증과 Codex skill 제작·점검은 각각 설치된 React workflow, 저장소 지침·checklist, system-managed `skill-creator`가 담당한다. 이 adapter는 같은 범위를 다시 감싸지 않는다.

저장소와 adapter 경로가 이미 frontend 범위를 제공하므로 skill name에는 `frontend-` 접두사를 반복하지 않는다. React 범위와 제외 조건은 각 description에서 구분한다.

이 저장소는 수집용이므로 `skills/`를 자동 발견 위치인 `.agents/skills`로 노출하지 않는다. 실제 프로젝트에서 필요할 때만 해당 workflow를 project-local skill로 구성하거나, 이 adapter를 참고해 그 프로젝트의 경로와 검증 명령에 맞게 작성한다.

project-local skill로 옮길 때는 `SKILL.md` 파일만 복사하지 않는다. description과 workflow는 유지하되, 연결된 catalog pattern·reference test를 대상 프로젝트에서 접근 가능한 경로로 다시 연결하고 그 프로젝트의 package version과 검증 명령을 적는다. 세부 채택 경계는 [공통 adapter 계약](../README.md#adapter-채택-계약)을 따른다.
