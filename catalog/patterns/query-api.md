# Query와 API 경계

## 권장 분리

- `types.ts`: validated domain type과 command type
- `schemas.ts`: `unknown → domain` runtime parser
- `api.ts`: path, method, request/response adapter
- `query-keys.ts`: domain key factory
- `queries.ts`: query options 또는 hook
- `mutations.ts`: 쓰기 동작이 있을 때만 생성

Feature는 API 계층을 직접 소비하고 다른 feature를 통과하지 않는다. API 계층은 UI component와 navigation을 소유하지 않는다.

## Query key

- root와 domain scope를 고정하고 list params와 detail id를 구조적으로 분리한다.
- queryFn이 소비하는 모든 서버 입력을 key에 포함한다.
- object params는 undefined와 default를 정규화한 뒤 key에 넣는다.

## Mutation

- API 성공 결과를 runtime parse한다.
- 최소 범위 key를 invalidate하거나 서버가 반환한 entity로 cache를 갱신한다.
- navigation, toast, form close는 feature wrapper가 결정한다.
- 실패 시 draft를 reset하지 않는다.

## 오류

HTTP 실패, 응답 JSON 파싱 실패, domain schema 실패를 구분하되 UI에는 안전한 메시지만 전달한다. status와 machine-readable code가 필요하면 `ApiError` 같은 transport error에 보존한다.
