# Frontend Review Checklists

## Correctness pass

- route matching, direct entry, auth gate, lazy/error reset
- query key 입력 누락, 잘못된 cache 공유, mutation invalidation
- initial loading, error, empty, background refetch 상태 누락
- URL search/filter/page, IME, history, page reset
- form reset, mode/subtype valid matrix, 실패 뒤 draft, 중복 제출
- `unknown → domain` parsing과 정보 유실
- 401 refresh race, retry loop, 오래된 session 응답
- overflow, keyboard, focus, 접근성 이름
- 변경된 상태 전이의 test와 runtime 검증

## Design-quality pass

- 상위 파일만 읽고 주요 흐름과 부수효과 owner를 설명할 수 있는가?
- route/page, query/mutation, domain transform, section interaction, presentational UI가 구분되는가?
- 같은 lifecycle과 변경 이유를 가진 코드가 가까이 있는가?
- 파생값을 state/effect로 복제하지 않는가?
- component 추출이 책임과 테스트 경계를 만드는가, 줄만 옮기는가?
- 공용화가 JSX 모양이 아니라 공유 계약을 근거로 하는가?
- `as` 단언이나 fallback이 계약 오류를 숨기지 않는가?
- 작은 변경이 관련 없는 feature와 fixture까지 번지는가?

## 증거 기준

줄 수, export 수, 이름 취향은 조사 신호일 뿐 finding 자체가 아니다. 실제 사용자 영향, 잘못된 상태 전이, 탐색 비용, 결합, 테스트 난이도를 증거로 제시한다.
