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

## 소비 프로젝트 통합 책임

이 pattern의 범위 밖인 form UI를 붙일 때도 draft guard와 validation feedback이 서로 레이아웃·focus 계약을 깨지 않는지 확인한다.

- 나란한 field는 helper/error 한 줄 공간을 같은 높이로 확보해 validation 전후 grid row와 아래 action이 움직이지 않게 한다.
- field error는 control과 `aria-describedby`로 연결하고 submit 실패 시 첫 invalid field 또는 form-level error로 focus를 이동한다.
- `PromptComponent`를 교체하면 modal semantics와 accessible name/description, initial focus, Tab containment, Escape, 이전 focus 복원을 소비자가 다시 소유한다.

전체 진입·통합 순서는 [프로젝트 진입 체크리스트](../checklists/project-entry.md)를 따른다.
