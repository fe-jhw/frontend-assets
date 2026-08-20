---
name: local-pagination
description: "React modal, tab, client-side collection처럼 공유 URL이나 browser history가 필요 없는 일시적 목록의 component-local pagination을 구현하거나 리팩터링할 때 사용한다. 링크 공유·새로고침 복원이 필요한 목록에는 사용하지 않는다."
---

# Local Pagination

화면 생명주기 안에서 page와 size를 소유하는 작은 pagination 경계를 구현한다. URL 목록 상태와 별개의 Codex workflow adapter다.

## Workflow

1. 목록 상태가 unmount 때 폐기되어도 되는지 확인한다.
2. [URL과 local state 선택](../../../../catalog/patterns/list-state-selection.md)으로 local 소유권이 맞는지 확인한다.
3. [Local pagination](../../../../catalog/patterns/local-pagination.md)의 reset과 보정 규칙을 적용한다.
4. [Local pagination 검증 matrix](../../../../catalog/patterns/verification.md#local-pagination)를 실행한다.

## Reference code

[`src/local-list-state`](../../../../catalog/examples/react-spa-foundation/src/local-list-state)와 [`src/pagination`](../../../../catalog/examples/react-spa-foundation/src/pagination)에서 필요한 hook, pure value 함수와 테스트만 참고한다.

## Invariants

- page와 size는 local owner 한 곳에만 둔다.
- size, search, filter 변경 시 page를 1로 reset한다.
- `totalPages`와 page slice 같은 파생값은 state로 복제하지 않는다.
- 복원 요구가 생기면 mode flag를 추가하지 말고 URL, 상위 owner 또는 session storage로 명시적으로 승격한다.
