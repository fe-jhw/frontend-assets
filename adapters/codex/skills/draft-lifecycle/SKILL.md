---
name: draft-lifecycle
description: "React Hook Form create/edit 화면에서 async entity의 최초 로드·전환 reset, 동일 entity refetch의 dirty draft 보존, route·내부 전환·beforeunload 이탈 보호를 구현하거나 리팩터링할 때 사용한다. 일반 validation, schema, submit, server error 처리만 다루는 작업에는 사용하지 않는다."
---

# Draft Lifecycle

폼 데이터 수명주기와 사용자 draft 손실 방지를 구현한다.

## Workflow

1. 설치된 React Hook Form version과 form identity, initial query, navigation owner를 확인한다.
2. [Form draft lifecycle](../../../../catalog/patterns/form-draft-lifecycle.md)의 reset matrix에서 현재 사건에 맞는 전이를 선택한다.
3. router에 맞는 dirty guard를 route 이동, 내부 전환과 `beforeunload`에 연결한다.
4. 최초 로드, entity 전환, 동일 entity refetch와 취소한 이동을 가까운 test와 실제 navigation으로 확인한다.

## Reference code

[`src/form-draft`](../../../../catalog/examples/react-spa-foundation/src/form-draft)에서 필요한 reset·guard module과 테스트만 참고한다.

## Invariants

- 동일 entity background refetch는 dirty draft를 덮지 않는다.
- 다른 entity 전환은 사용자 확인 뒤 새 default로 reset한다.
- 사용자가 이탈을 취소하면 현재 draft와 위치를 유지한다.
- 일반 validation, submit 상태와 server error surface는 이 workflow가 소유하지 않는다.
