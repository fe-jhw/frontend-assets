# 채택 판단

## Skill로 둘 것

여러 단계의 조사와 구현 순서가 반복되고, 호출 시점이 분명한 작업은 skill이 맡는다. 목록·폼 생성은 대상의 version과 기존 구조를 조사하고 여러 경계를 함께 연결하므로 workflow skill이 적합하다.

## AGENTS에 둘 것

모든 작업에 항상 적용되는 import 방향, 검증 명령, 사용자 변경 보존, 서버 상태 소유권은 짧게 AGENTS에 둔다. 구체적인 hook API나 긴 edge-case matrix는 두지 않는다.

## Reference에 둘 것

특정 작업에서만 필요한 정책과 판단표는 reference로 둔다. 호출될 때마다 전부 읽을 필요가 없는 세부 내용이다.

## 코드 자산으로 둘 것

컴파일러와 테스트가 보호해야 하는 상태 전이는 코드로 둔다. URL 정규화, query key shape, 401 concurrency, draft reset은 prose만으로 재작성하지 않는다.

## 도입 gate

- 같은 계약이 둘 이상의 화면에서 반복되는가?
- 한 번 틀리면 draft 손실, 인증 race, 잘못된 cache처럼 복구 비용이 큰가?
- 기존 프로젝트 경계에 자연스럽게 들어가는가?
- module과 test를 함께 유지할 owner가 있는가?

첫 두 질문이 모두 아니면 feature-local 구현을 우선한다.
