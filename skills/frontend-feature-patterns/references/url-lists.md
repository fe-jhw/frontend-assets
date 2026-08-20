# URL 기반 목록 상태

## 소유권

- URL: 확정된 query, filter, sort, page, size
- local state: 입력 중인 search draft, composition 여부, transient open state
- query cache: 서버 응답과 fetching/error 상태

URL을 local state에 다시 복사하지 않는다. 파생 가능한 값은 search params에서 계산한다.

## 전이 규칙

| 입력               | URL 기록               | History | page         |
| ------------------ | ---------------------- | ------- | ------------ |
| 검색 확정          | trim한 non-empty query | push    | 삭제         |
| 검색 clear         | query 삭제             | push    | 삭제         |
| filter 변경        | default면 param 삭제   | push    | 삭제         |
| size 변경          | default면 param 삭제   | push    | 삭제         |
| 잘못된 값 정규화   | canonical 값 또는 삭제 | replace | 필요 시 삭제 |
| page 이동          | 1이면 param 삭제       | push    | 변경         |
| 서버가 page를 보정 | resolved page          | replace | 보정         |

IME composition 중 Enter는 submit하지 않는다. composition 종료 뒤 Enter만 확정한다.

## Query 연결

정규화된 URL 값으로 query params와 query key를 만든다. 목록 전환 중 기존 data가 있으면 `placeholderData: keepPreviousData`처럼 화면 surface를 유지하는 정책을 검토한다.
