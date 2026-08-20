# 저장소 구조와 소유권

## 저장소 성격

이 저장소는 검증된 프론트엔드 자산을 축적하는 카탈로그다. 소비 프로젝트는 기존 구조와 책임 경계에 필요한 판단 기준, module, test 또는 설정 일부를 가져간다.

## 세 계층

### Catalog

`catalog/`가 canonical source다.

- `patterns/`: 기술과 상태 소유권을 고르는 판단 기준
- `checklists/`: review와 verification에서 재사용할 점검표
- `examples/`: 실제 compiler와 test로 검증하는 코드 예제
- `scripts/`: 특정 agent 없이 실행할 수 있는 deterministic 진단

내용을 수정할 때는 canonical catalog를 먼저 고치고 agent adapter는 해당 자산을 연결한다.

### Adapter

`adapters/<tool>/`은 특정 coding agent가 catalog를 언제 읽고 어떻게 적용할지 설명한다. 현재는 Codex adapter만 있다.

- adapter는 trigger, resource routing, tool 전용 metadata를 소유한다.
- frontend 패턴의 상세 계약과 코드 예제는 catalog가 소유한다.
- 다른 agent를 도입하면 같은 catalog를 가리키는 해당 형식의 얇은 adapter를 추가한다.

### Repository harness

루트 `AGENTS.md`, `scripts/check-repository.sh`, CI는 이 저장소 자체를 유지하는 repository harness다.

## 자산 추가 기준

1. 둘 이상의 실제 사용처에서 반복됐거나 잘못 구현했을 때 손실이 큰가?
2. 제품 고유 endpoint, role, copy, UI 치수 없이도 의미가 유지되는가?
3. prose보다 코드나 script로 고정해야 하는 상태 전이가 있는가?
4. 대상 프로젝트가 선택할 여지를 남기면서도 판단이 달라질 비자명한 내용을 담는가?

기준이 확인되기 전에는 제품 코드가 해당 구현을 소유한다. 새 자산은 pattern/reference로 시작하고, 반복되는 여러 단계 workflow가 확인되면 agent skill로 승격한다.

## 자산 형식 선택

| 형식              | 적합한 내용                                                        | 피할 내용                              |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------- |
| 프로젝트 지침     | 모든 작업에 적용되는 짧은 규칙, 실제 검증·commit 명령, import 방향 | 긴 edge case, 특정 화면 구현법         |
| Pattern·checklist | 특정 문제에서 읽는 판단표, 불변식, acceptance criteria             | 호출 순서와 도구 조작을 복제한 본문    |
| Agent workflow    | 하나의 사용자 의도로 반복되는 여러 단계의 조사·구현                | 상시 태도, 일반 제품 사용법, 단일 규칙 |
| Script            | syntax, structure, 변환, 산출물 분석처럼 결정적인 검사             | 의미와 설계 품질의 최종 판단           |
| Example           | compiler와 test로 보호할 상태 전이                                 | 제품 구조를 암묵적으로 정하는 예제     |

agent workflow를 추가하기 전에 다음 순서로 확인한다.

1. agent 자체 기능이나 관리형 workflow가 같은 범위를 이미 제공하는가?
2. description만 보고도 인접 workflow와 다른 하나의 사용자 의도로 선택할 수 있는가?
3. 항상 적용되는 규칙이면 프로젝트 지침으로, 결정적인 검사면 script로 충분하지 않은가?
4. 둘 이상의 실제 작업에서 같은 여러 단계가 반복됐는가?

가장 단순한 소유자를 선택하고 한 규칙은 한 canonical 자산에 둔다. adapter는 그 위치를 가리킨다.

## 의도적으로 제외하는 내용

- 제품 고유 query-key root, storage key, event name, endpoint, role, 오류 문구
- 특정 UI kit class, table column, skeleton 치수, 임의 viewport 수치
- 특정 heavy dependency 이름을 전제로 한 강제 chunk group
- 특정 프로젝트의 개발 서버, backend 동시 기동, 배포 환경 파일
- 관리형 skill의 복사본과 이미 agent가 기본 제공하는 일반 작업 workflow
- 한 번만 나타난 feature-local 추상화와 미래 사용을 예상한 wrapper
