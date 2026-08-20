# Commit Policy

## 먼저 기존 계약을 확인한다

대상 저장소의 `AGENTS.md`, `CONTRIBUTING.md`, commitlint 설정과 최근 commit history가 이 문서보다 우선한다. 기존 계약이 없을 때 아래 규칙을 baseline으로 사용한다. 이 정책은 commit 생성이나 push 권한을 뜻하지 않는다.

## 메시지 형식

```text
<type>(<scope>): <summary>
```

기본 type:

| Type       | 사용 조건                        |
| ---------- | -------------------------------- |
| `feat`     | 사용자가 쓸 수 있는 기능 추가    |
| `fix`      | 결함이나 잘못된 동작 수정        |
| `refactor` | 외부 동작을 유지한 구조 변경     |
| `perf`     | 측정 가능한 성능 개선            |
| `test`     | 제품 동작 변경 없는 test 보강    |
| `docs`     | 문서만 변경                      |
| `build`    | dependency와 build pipeline 변경 |
| `ci`       | CI workflow 변경                 |
| `chore`    | 위 유형에 속하지 않는 유지보수   |
| `revert`   | 이전 commit 되돌림               |

breaking change는 type 뒤에 `!`를 붙이고 body 또는 footer에 영향과 migration을 적는다.

```text
feat(auth)!: token 저장 계약 변경
```

## Scope 선택

scope는 파일 위치보다 변경을 다시 찾을 때 사용할 제품 영역이나 기술 경계를 표현한다.

- frontend 전용 저장소: `fix(목록): refetch 중 기존 데이터 유지`
- multi-layer 저장소: `fix(프론트/목록): URL 상태 정규화`
- multi-layer 저장소: `fix(API/목록): pagination 응답 계약 보정`
- 공통 계약: `docs(계약/목록): page 범위 설명 보강`

저장소 자체가 frontend 범위를 제공하면 `프론트/`를 모든 scope에 반복하지 않는다. 여러 layer가 있는 저장소에서만 `<layer>/<domain>`을 사용한다. `misc`, `update`, `changes`처럼 검색 가치가 낮은 scope는 피한다.

## Summary 작성

- 무엇을 만졌는지가 아니라 이 commit으로 달라지는 결과를 짧게 쓴다.
- `수정`, `작업`, `업데이트`만으로 끝내지 않고 대상과 변화를 함께 적는다.
- ticket 번호와 파일명만 summary로 쓰지 않는다.
- 배경, 선택 이유, migration이나 남은 위험이 필요하면 body에 쓴다.

## Atomic commit

- 하나의 commit은 review와 revert가 가능한 하나의 의도를 가진다.
- 같은 의도를 구현하고 증명하는 code, test, fixture와 문서는 함께 둔다.
- 무관한 refactor, formatting, dependency update와 문서 정리를 섞지 않는다.
- frontend와 backend는 같은 계약을 원자적으로 완성해야 할 때만 함께 묶고, 독립적으로 유효하면 layer별로 나눈다.
- lockfile은 그 원인이 된 dependency 변경과 같은 commit에 둔다.
- 작업 중 발견한 별도 결함은 현재 의도와 분리한다.

## Commit 직전

1. `git status --short`와 staged diff로 대상 파일과 비밀값·생성물을 확인한다.
2. 현재 의도에 필요한 파일만 stage한다. 다른 사람이나 사용자의 변경을 함께 넣지 않는다.
3. 변경 위험도에 맞는 format, type, lint, test와 runtime 검증을 완료한다.
4. 메시지가 staged diff의 가장 중요한 결과를 설명하는지 확인한다.
5. 자동 `--amend`, squash, rebase와 push는 저장소 workflow나 명시적 요청이 있을 때만 수행한다.

## 선택적 자동 검사

[`check-commit-message.mjs`](../scripts/check-commit-message.mjs)는 header 형식과 type만 dependency 없이 검사한다. commitlint나 기존 hook이 없을 때 선택적으로 연결한다. Git이 자동 생성한 `Revert "…"`와 `Merge …` header는 일반 revert·merge workflow를 막지 않도록 허용한다. atomicity, scope 품질과 summary 의미는 script가 대신 판단할 수 없다.
