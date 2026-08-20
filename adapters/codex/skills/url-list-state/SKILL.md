---
name: url-list-state
description: "React 목록의 search, filter, sort, page, size를 공유·새로고침 복원·뒤로가기가 가능한 URL canonical state로 구현하거나 리팩터링할 때 사용한다. modal이나 tab 안에서만 유지되는 임시 local pagination에는 사용하지 않는다."
---

# URL List State

URL이 목록 탐색 상태의 단일 source가 되도록 구현한다. 이 스킬은 Codex용 workflow adapter이며 판단 기준과 예제의 원본은 tool-neutral catalog가 소유한다.

## Workflow

1. 대상 프로젝트의 router와 query-string API, 목록 query key, 인접 테스트를 확인한다.
2. [URL과 local state 선택](../../../../catalog/patterns/list-state-selection.md)에서 URL 소유권이 맞는지 확인한다.
3. [URL pagination](../../../../catalog/patterns/url-pagination.md)의 정규화와 history 규칙을 적용한다.
4. 변경한 전이를 [URL 목록 검증 matrix](../../../../catalog/patterns/verification.md#url-목록)로 확인한다.

## Reference code

[`src/url-list-state`](../../../../catalog/examples/react-spa-foundation/src/url-list-state)와 [`src/pagination`](../../../../catalog/examples/react-spa-foundation/src/pagination)에서 현재 작업에 필요한 module과 인접 테스트를 한 단위로 참고한다.

## Invariants

- 확정된 query, filter, sort, page, size는 URL만 소유한다.
- 입력 중 search draft와 IME 상태만 local state에 둔다.
- default와 invalid parameter는 canonical URL로 `replace`하고 사용자 탐색은 `push`한다.
- query/filter/size 변경은 page를 1로 되돌린다.
- 같은 page를 URL과 local state 양쪽에 저장하지 않는다.
