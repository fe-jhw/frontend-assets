---
name: ui-states
description: "React 화면의 initial loading, blocking error, empty, background refetch error, mutation error 또는 render error boundary 상태를 설계·구현·리팩터링할 때 사용한다. API transport나 query key 설계만 다루는 작업에는 사용하지 않는다."
---

# UI States

데이터와 render 실패의 owner에 맞는 화면 surface를 구현한다.

## Workflow

1. 상태가 render exception, initial query, background refetch, empty result, mutation 중 어디서 발생하는지 분류한다.
2. [Error, Loading, Empty 상태](../../../../catalog/patterns/ui-states.md)의 owner와 surface를 적용한다.
3. [Query와 UI 상태 검증](../../../../catalog/patterns/verification.md#query와-ui-상태)으로 모든 의미 있는 조합을 확인한다.
4. layout을 바꾸면 실제 viewport에서 skeleton, toolbar, body와 pagination의 안정성을 확인한다.

## Reference code

[`src/error`](../../../../catalog/examples/react-spa-foundation/src/error), [`src/query`](../../../../catalog/examples/react-spa-foundation/src/query)와 [`ItemsPage.tsx`](../../../../catalog/examples/react-spa-foundation/src/features/items/ItemsPage.tsx)에서 관련 부분과 테스트만 참고한다.

## Invariants

- 기존 data가 있는 refetch와 최초 pending을 같은 blocking surface로 처리하지 않는다.
- render error boundary가 event handler나 mutation error까지 잡는다고 가정하지 않는다.
- boundary reset은 React tree와 실패한 query 상태를 함께 고려한다.
- empty와 skeleton은 최종 layout의 주요 slot을 불필요하게 흔들지 않는다.
