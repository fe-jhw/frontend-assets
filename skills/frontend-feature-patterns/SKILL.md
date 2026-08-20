---
name: frontend-feature-patterns
description: "React SPA에서 URL 기반 목록, TanStack Query/API 계층, 인증 갱신, React Hook Form draft, error/loading/empty 상태를 구현하거나 리팩터링할 때 사용한다. 한 번뿐인 화면이나 이미 안정된 로컬 패턴에는 전체 묶음을 강제하지 않고 필요한 경계만 선별 적용한다."
---

# Frontend Feature Patterns

반복되는 feature 기반을 책임 단위로 구현한다. 이 skill은 완성형 프레임워크를 설치하는 도구가 아니라, 대상 프로젝트에서 이미 확인된 반복과 위험에 맞는 pattern만 선택하는 workflow다.

## 시작

1. 대상 프로젝트의 `AGENTS.md`, package manager, `package.json`, lockfile을 확인한다.
2. router, query library, form library, auth transport와 가까운 구현·테스트를 읽는다.
3. [adoption.md](references/adoption.md)로 적용할 pattern과 적용하지 않을 pattern을 먼저 정한다.
4. 설치된 major version이 예제와 다르면 예제 API를 그대로 복사하지 않는다.

## Reference routing

- URL search/filter/pagination 또는 IME를 다루면 [url-lists.md](references/url-lists.md)를 읽는다.
- query key, API adapter, parsing, mutation invalidation을 다루면 [query-api.md](references/query-api.md)를 읽는다.
- login, token 저장, refresh, 401 retry를 다루면 [auth-api-client.md](references/auth-api-client.md)를 읽는다.
- create/edit form, reset, dirty 이동 보호를 다루면 [form-drafts.md](references/form-drafts.md)를 읽는다.
- error boundary, loading, empty, background error를 다루면 [ui-states.md](references/ui-states.md)를 읽는다.
- ESLint, Prettier, TypeScript, Vite, Vitest 설정을 옮기면 [tooling.md](references/tooling.md)를 읽는다.
- 구현 뒤 검증 matrix는 [verification.md](references/verification.md)에서 해당 section만 읽는다.

## 코드 자산

`assets/react-spa-foundation`은 타입체크와 테스트가 가능한 reference package다. 파일 하나만 가져갈 때도 가까운 test와 입력 계약을 함께 가져간다.

- `src/url-list-state`: URL source, committed search, IME, pagination
- `src/query`와 `src/api/items`: query key, view state, runtime parsing, mutation
- `src/auth`와 `src/api-client`: 주입 가능한 token store와 refresh single-flight
- `src/form-draft`와 `src/features/items`: draft guard, reset, RHF form, list page
- `src/error`: render error boundary

## 구현 원칙

- 기존 책임 경계로 해결되면 새 공용 layer를 만들지 않는다.
- endpoint, schema, storage key, 사용자 문구와 UI component는 대상 프로젝트 소유다.
- browser storage token 예제는 보안 정책이 아니라 교체 가능한 adapter다. httpOnly cookie/BFF 구조에서는 사용하지 않는다.
- 변경한 상태 전이는 가장 작은 pure test 또는 component test로 먼저 고정한다.
- UI 동작·routing·layout을 바꾸면 대상 프로젝트의 브라우저 검증 절차를 따른다.
