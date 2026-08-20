---
name: query-api
description: "React와 TanStack Query 기반 코드에서 query key, runtime response parsing, API adapter, mutation cache update 또는 invalidation 경계를 구현하거나 리팩터링할 때 사용한다. 인증 token refresh나 일반 UI 상태 표현만 다루는 작업에는 사용하지 않는다."
---

# Query API

서버 데이터의 transport, domain parsing, cache identity와 mutation 책임을 분리한다.

## Workflow

1. 설치된 TanStack Query major version, 기존 query key와 API client를 확인한다.
2. [Query와 API 경계](../../../../catalog/patterns/query-api.md)를 읽고 필요한 책임만 채택한다.
3. query function이 소비하는 모든 정규화된 입력을 query key에 포함한다.
4. [Query와 UI 상태 검증](../../../../catalog/patterns/verification.md#query와-ui-상태) 중 cache와 mutation 항목을 확인한다.

## Reference code

[`src/query`](../../../../catalog/examples/react-spa-foundation/src/query)와 [`src/api/items`](../../../../catalog/examples/react-spa-foundation/src/api/items)에서 대상 경계와 가까운 테스트만 참고한다.

## Invariants

- `unknown` 응답은 UI에 도달하기 전에 runtime parse한다.
- navigation, toast와 form close는 API adapter가 아니라 feature가 결정한다.
- mutation 실패 시 draft나 기존 화면 상태를 임의로 지우지 않는다.
- 기존 프로젝트 경계로 충분하면 새 공용 wrapper를 만들지 않는다.
