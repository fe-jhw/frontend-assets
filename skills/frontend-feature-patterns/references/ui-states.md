# Error, Loading, Empty 상태

## 경계

| 상태                      | owner                         | 기본 surface                                  |
| ------------------------- | ----------------------------- | --------------------------------------------- |
| render exception          | app 또는 route error boundary | 전체 route fallback과 reset                   |
| data 없음 + pending       | query를 소비하는 page/section | skeleton 또는 loading                         |
| data 없음 + error         | page/section                  | blocking error와 retry                        |
| data 있음 + refetch       | page/section                  | 기존 data 유지, 필요한 곳만 progress          |
| data 있음 + refetch error | page/section                  | 기존 data와 non-blocking error                |
| 성공한 빈 collection      | list surface                  | 높이와 toolbar/pagination slot을 유지한 empty |
| mutation error            | form/action owner             | root error, field error 또는 toast            |

render boundary는 event handler와 async callback 오류를 자동으로 잡지 않는다. mutation과 event 오류는 해당 workflow에서 처리한다.

Error boundary reset은 route identity와 query error reset을 함께 고려한다. reset button이 React tree만 다시 렌더하고 실패한 query 상태를 그대로 두는지 확인한다.

Skeleton은 최종 화면에 없는 설명과 section을 만들지 않는다. 목록 toolbar, body, pagination의 위치와 높이감을 최종 surface와 맞춘다.
