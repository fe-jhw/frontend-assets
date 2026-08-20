# 카탈로그 사용 방법

## 0. 프로젝트 계약을 먼저 확인한다

새 프로젝트를 시작하거나 기존 프로젝트에 처음 들어가면 [프로젝트 진입 체크리스트](../catalog/checklists/project-entry.md)로 기술 버전, 환경 설정, 기존 상태 owner, design source, 접근성 기준과 검증 명령을 먼저 확인한다.

design system, 환경 변수와 실행 명령의 선택과 소유권은 소비 프로젝트에 둔다.

## 1. 문제에서 시작한다

현재 프로젝트에서 반복되는 문제, 실패 비용이 큰 경계, 구현 전에 합의가 필요한 상태 소유권부터 찾아 필요한 자산을 좁힌다.

예제 기준은 [catalog/COMPATIBILITY.md](../catalog/COMPATIBILITY.md)에 기록한다. 대상 프로젝트의 major version이 다르면 설치된 API에 맞게 이식 범위를 조정한다.

## 2. Pattern으로 선택한다

- 목록 상태와 pagination: [list-state-selection.md](../catalog/patterns/list-state-selection.md)
- query key, runtime parsing, mutation: [query-api.md](../catalog/patterns/query-api.md)
- 인증 refresh와 API client: [auth-api-client.md](../catalog/patterns/auth-api-client.md)
- form draft와 reset: [form-draft-lifecycle.md](../catalog/patterns/form-draft-lifecycle.md)
- loading, error, empty: [ui-states.md](../catalog/patterns/ui-states.md)
- tooling baseline: [tooling.md](../catalog/patterns/tooling.md)
- commit 단위와 메시지: [commit-policy.md](../catalog/patterns/commit-policy.md)

문서는 선택 기준과 불변식을 설명한다. 대상 프로젝트의 endpoint, schema, UI component와 사용자 문구는 대상 프로젝트가 소유한다.

## 3. 필요한 코드와 테스트만 참고한다

[react-spa-foundation](../catalog/examples/react-spa-foundation)은 module과 상태 전이를 검증하는 실행 가능한 reference package다. 필요한 module을 참고할 때 가까운 test도 함께 읽고, 대상 프로젝트의 구조에 맞게 다시 작성하거나 선별 이식한다.

여러 자산을 함께 쓸 때는 체크리스트의 workflow별 조립 순서로 owner와 dependency를 먼저 연결한다. 채택 단위는 필요한 pattern, module, test와 설정이다.

## 4. Agent adapter는 선택 사항이다

Codex를 쓰면 [Codex adapter](../adapters/codex/README.md)를 통해 catalog를 라우팅할 수 있다. 다른 agent는 같은 canonical catalog를 가리키는 전용 adapter를 둘 수 있다.

## 5. 실제 프로젝트에서 다시 검증한다

catalog의 test는 reference 자체를 검증한다. 소비 프로젝트에서는 package version, router mode, 인증 architecture, 브라우저 지원 범위와 acceptance criteria로 채택 결과를 다시 검증한다.
