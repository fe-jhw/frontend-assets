# 목록 상태와 Pagination 선택

Pagination 구현 전에 상태의 생명주기와 공유 범위를 먼저 정한다. URL 방식과 로컬 방식은 API 모양이 비슷해도 사용자 계약이 다르므로 하나의 hook에 mode flag로 합치지 않는다.

## 선택표

| 질문 | URL canonical state | Local state |
| --- | --- | --- |
| 새로고침 뒤 같은 목록을 복원해야 하는가? | 적합 | 부적합 |
| 링크 공유·북마크가 의미 있는가? | 적합 | 부적합 |
| 뒤로가기에서 이전 page/filter를 복원해야 하는가? | 적합 | 부적합 |
| modal, tab 내부의 일시적인 작은 목록인가? | 과할 수 있음 | 적합 |
| 다른 화면으로 이동하면 상태가 사라져도 되는가? | 불필요할 수 있음 | 적합 |
| SSR·loader·server cache key가 URL을 소비하는가? | 적합 | 별도 동기화 필요 |

둘 다 의미가 있다면 공유·탐색 계약은 URL이 소유하고, 입력 draft나 transient selection만 local state로 둔다. 같은 `page`를 URL과 local state 양쪽에 저장하지 않는다.

## 공통 불변식

- page는 1 이상의 정수다.
- size는 지원 목록에서만 선택한다.
- size, search, filter가 바뀌면 page를 1로 되돌린다.
- 서버가 요청 page를 보정하면 실제 응답 page를 canonical state에 반영한다.
- UI는 initial loading과 기존 data가 있는 background fetching을 구분한다.

## 구현 경로

- 공유·복원·history가 필요하면 [URL 기반 pagination](url-pagination.md)을 사용한다.
- component 생명주기 안의 임시 목록이면 [로컬 pagination](local-pagination.md)을 사용한다.
