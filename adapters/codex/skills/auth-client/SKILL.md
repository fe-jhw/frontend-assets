---
name: auth-client
description: "브라우저 API client의 bearer token 저장소, concurrent 401 refresh, 한 번의 retry, session generation 또는 내부·외부 URL 경계를 구현하거나 진단할 때 사용한다. 로그인 화면 UI나 단순 권한 표시만 다루는 작업에는 사용하지 않는다."
---

# Auth Client

인증 transport의 concurrency와 session 경계를 안전하게 구현한다. token 저장 방식은 대상 시스템의 보안 구조가 소유한다.

## Workflow

1. 서버가 httpOnly cookie/BFF를 지원하는지와 현재 token owner를 먼저 확인한다.
2. bearer token을 브라우저가 소유해야 할 때만 [인증과 API client](../../../../catalog/patterns/auth-api-client.md)를 적용한다.
3. [인증 검증 matrix](../../../../catalog/patterns/verification.md#인증)로 동시 401, 늦은 응답과 session 전환을 확인한다.

## Reference code

[`src/auth`](../../../../catalog/examples/react-spa-foundation/src/auth)와 [`src/api-client`](../../../../catalog/examples/react-spa-foundation/src/api-client)의 implementation과 concurrency test를 함께 참고한다.

## Invariants

- 같은 session generation의 동시 401은 refresh promise 하나를 공유한다.
- 원 요청은 최대 한 번만 재시도한다.
- logout이나 새 login 뒤 도착한 이전 refresh 결과는 현재 session을 덮지 않는다.
- absolute external URL에는 인증 header를 자동 부착하지 않는다.
- localStorage 예제를 보안 권고로 취급하지 않는다.
