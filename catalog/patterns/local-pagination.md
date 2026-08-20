# 로컬 Pagination

링크 공유, 새로고침 복원과 browser history가 필요 없는 일시적인 목록은 component-local state가 소유한다. 예: modal 안 검색 결과, 한 화면의 독립 tab, 이미 메모리에 있는 client-side collection.

## 소유권

- local state: page와 size
- props/query cache: 원본 collection 또는 서버 응답
- derived render value: 현재 page slice, total pages, disabled state

page와 size를 URL에도 동시에 저장하지 않는다. 부모가 상태를 보존해야 하면 hook 내부 state를 억지로 우회하지 말고 controlled state 또는 더 가까운 owner로 끌어올린다.

## 전이 규칙

| 입력 | page | size |
| --- | --- | --- |
| page 이동 | 1 이상으로 보정 | 유지 |
| size 변경 | 1로 reset | 지원 값으로 보정 |
| 검색·filter 변경 | 1로 reset | 유지 |
| 목록 길이 감소 | 마지막 유효 page로 보정 | 유지 |
| component unmount | 기본적으로 폐기 | 기본적으로 폐기 |

## 구현 주의

- 파생 가능한 `totalPages`와 page slice를 별도 state에 복제하지 않는다.
- 기본 page-size 배열은 module constant로 두어 effect/callback dependency를 불안정하게 만들지 않는다.
- 서버 pagination이라도 공유·history 계약이 없으면 local state를 query key 입력으로 사용할 수 있다.
- 화면을 다시 열었을 때 복원이 필요해지는 순간 URL, 상위 owner 또는 session storage 중 요구사항에 맞는 source로 승격한다.
