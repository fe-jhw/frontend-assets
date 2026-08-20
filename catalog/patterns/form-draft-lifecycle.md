# Form Draft Lifecycle

## 책임

- wrapper/page: initial query, form identity, navigation
- form: default values, dirty state, reset 진입
- pure model: server snapshot을 form default로 바꾸는 mapping
- draft guard: route 이동, 내부 전환, beforeunload

## Reset matrix

| 사건                           | dirty draft                |
| ------------------------------ | -------------------------- |
| 최초 entity 로드               | default로 초기화           |
| 다른 entity로 전환             | 확인 후 새 default로 reset |
| 같은 entity background refetch | 보존                       |
| mutation pending               | 보존                       |
| mutation 실패                  | 보존                       |
| 저장 성공 후 화면 종료         | 별도 reset 불필요          |
| 사용자가 명시적으로 초기화     | reset                      |

React Hook Form의 `defaultValues`는 최초 snapshot이다. 비동기 data를 적용할 때 새 객체 reference가 아니라 안정적인 form identity와 server snapshot key를 함께 넘기고 dirty 여부를 기준으로 reset한다.

## 범위 밖

field validation, schema 선택, submit 중복 방지, mutation error 배치는 프로젝트의 일반 form workflow가 소유한다. 이 pattern은 비동기 default 전환과 저장되지 않은 draft의 수명주기만 고정한다.
