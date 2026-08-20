# 폼과 Draft

## 책임

- wrapper/page: initial query, mutation, navigation, 성공 후 이동
- form: default values, validation, field error, submit 진입
- pure model: normalization, valid-state matrix, DTO mapping
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

## 오류

한 field가 고치면 해결되는 오류만 field에 둔다. 권한, 네트워크, 여러 값 관계는 `root.server` 또는 form-level surface로 둔다. invalid submit은 첫 오류 control 또는 focus 가능한 오류 section으로 이동할 수 있어야 한다.

## 제출

`formState.isValid`만으로 버튼을 막지 않는다. submit 경계에서 schema를 실행하고 pending 동안 중복 제출만 차단한다. 실패 시 입력과 dirty 상태를 유지한다.
