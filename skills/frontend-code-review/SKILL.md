---
name: frontend-code-review
description: "React 프론트엔드의 code review, PR review, feature 전수 점검, 가독성·유지보수성 audit에 사용한다. 앱 코드와 설정을 correctness, data integrity, responsibility boundary, UI state, missing test 관점에서 검토하며 Codex skill·AGENTS 하네스 평가는 제외한다."
---

# Frontend Code Review

작성 의도나 기대 결론보다 대상 프로젝트의 `AGENTS.md`, 관련 reference, 실제 diff와 동작을 근거로 독립 리뷰한다. 사용자가 수정을 함께 요청하지 않았다면 파일을 변경하지 않는다.

## 범위

- 앱 코드, public asset, package/config, test, fixture, skeleton
- 제외: `.agents/skills`, `.codex`, `AGENTS.md` 자체. 이 범위에는 `frontend-skill-review`를 사용한다.

## 절차

1. working tree, PR diff, directory 또는 명시된 파일로 범위를 확정한다.
2. `AGENTS.md`, 관련 reference, package script를 읽는다.
3. directory 전수 리뷰는 manifest를 만들고 code, test, config, fixture를 빠뜨리지 않는다.
4. correctness pass와 design-quality pass를 분리한다.
5. 각 finding 후보를 정확한 파일/라인과 재현 가능한 상태 전이로 다시 확인한다.
6. 실행 검증이 필요하면 대상 프로젝트 검증 workflow 또는 `frontend-verification`을 사용한다.

전체 checklist는 [review-checklists.md](references/review-checklists.md)를 읽는다.

## 출력

- finding을 심각도 순으로 먼저 쓴다.
- 각 finding에 파일/라인, 영향, 근거, 가장 작은 책임 경계의 수정 방향을 포함한다.
- 전수 리뷰는 읽은 파일 수와 누락 파일을 적는다.
- finding이 없으면 추가 발견 없음과 남은 test/runtime gap을 보고한다.

심각도:

- `P0`: release blocker, data loss, security, app-wide breakage
- `P1`: core workflow regression 또는 사용자에게 보일 가능성이 높은 결함
- `P2`: 제한된 correctness, 반복되는 data drift, 큰 변경 비용, 중요한 test gap
- `P3`: future work에 실질적으로 영향을 주는 국소 품질 문제
