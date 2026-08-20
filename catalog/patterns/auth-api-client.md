# 인증과 API client

## 먼저 결정할 것

1. 서버가 httpOnly cookie를 지원하면 BFF/cookie 방식을 우선 검토한다.
2. bearer token을 브라우저가 소유해야 한다면 token store를 client에 주입한다.
3. 사용자 profile과 token lifecycle을 같은 localStorage blob으로 묶지 않는다. profile은 서버 query로 다시 확인할 수 있어야 한다.

## Refresh 불변식

- 같은 session generation에서 발생한 동시 401은 하나의 refresh promise를 공유한다.
- refresh가 끝나기 전에 도착한 늦은 401은 현재 token이 바뀌었는지 먼저 확인하고 새 token으로 재시도한다.
- 원 요청은 최대 한 번만 재시도한다.
- logout 또는 새 login 뒤 이전 refresh 결과가 도착해도 현재 session을 덮지 않는다.
- refresh 실패는 해당 generation의 session만 만료시키고 cache 정리와 로그인 이동은 auth owner가 수행한다.

## URL 경계

내부 API path는 base URL과 조합하고 absolute URL을 거부한다. presigned URL, CDN, 외부 download처럼 완성된 URL은 인증 header를 자동으로 붙이지 않는 별도 함수로 요청한다.

## 저장소 주의

localStorage는 XSS에 노출된다. 예제의 `createStorageTokenStore`는 기술적 adapter이며 보안 권고가 아니다. CSP, token lifetime, refresh rotation, logout invalidation은 서버와 함께 결정한다.
