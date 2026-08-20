# Harness 책임 배치

| 자산      | 적합한 내용                                                      | 부적합한 내용                               |
| --------- | ---------------------------------------------------------------- | ------------------------------------------- |
| AGENTS    | 모든 작업에 항상 적용되는 짧은 규칙, 실제 검증 명령, import 방향 | 긴 edge-case, 특정 화면 구현법, 일회성 이력 |
| Reference | 특정 영역에서 읽는 상세 정책, 판단표, acceptance criteria        | 호출 순서가 필요한 workflow                 |
| Skill     | trigger가 분명하고 여러 단계가 반복되는 조사·구현·검증 workflow  | 상시 태도, Codex 일반 지식, 한 파일 규칙    |
| Script    | syntax, structure, 변환, secret scan처럼 결정적인 반복 작업      | 의미·설계 품질의 최종 판단                  |
| Asset     | 복사·수정해서 쓰는 template, example, fixture                    | 반드시 읽어야 하는 핵심 지침                |

한 규칙은 하나의 canonical 자산이 소유한다. 다른 문서는 해당 위치를 가리키고 전체 문장을 복제하지 않는다.
