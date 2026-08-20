# 카탈로그 사용 방법

## 1. 문제에서 시작한다

이 저장소의 모든 항목을 설치하거나 복사하지 않는다. 현재 프로젝트에서 반복되는 문제, 실패 비용이 큰 경계, 구현 전에 합의가 필요한 상태 소유권부터 찾는다.

예제 기준은 [catalog/COMPATIBILITY.md](../catalog/COMPATIBILITY.md)에 기록한다. 대상 프로젝트의 major version이 다르면 API를 그대로 옮기지 않는다.

## 2. Pattern으로 선택한다

- 목록 상태와 pagination: [list-state-selection.md](../catalog/patterns/list-state-selection.md)
- query key, runtime parsing, mutation: [query-api.md](../catalog/patterns/query-api.md)
- 인증 refresh와 API client: [auth-api-client.md](../catalog/patterns/auth-api-client.md)
- form draft와 reset: [form-draft-lifecycle.md](../catalog/patterns/form-draft-lifecycle.md)
- loading, error, empty: [ui-states.md](../catalog/patterns/ui-states.md)
- tooling baseline: [tooling.md](../catalog/patterns/tooling.md)

문서는 선택 기준과 불변식을 설명한다. 대상 프로젝트의 endpoint, schema, UI component와 사용자 문구는 대상 프로젝트가 소유한다.

## 3. 필요한 코드와 테스트만 참고한다

[react-spa-foundation](../catalog/examples/react-spa-foundation)은 publish용 library나 starter가 아니라 실행 가능한 reference package다. 필요한 module을 참고할 때 가까운 test도 함께 읽고, 대상 프로젝트의 구조에 맞게 다시 작성하거나 선별 이식한다.

## 4. Agent adapter는 선택 사항이다

Codex를 쓰면 [Codex adapter](../adapters/codex/README.md)를 통해 catalog를 라우팅할 수 있다. 다른 agent를 쓰면 그 agent용 adapter를 추가할 수 있지만 catalog 본문과 코드는 바꾸지 않는다.

## 5. 실제 프로젝트에서 다시 검증한다

catalog의 test 통과는 소비 프로젝트의 호환성을 보장하지 않는다. 프로젝트의 package version, router mode, 인증 architecture, 브라우저 지원 범위와 acceptance criteria로 다시 검증한다.
