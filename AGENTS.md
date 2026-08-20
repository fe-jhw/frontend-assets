# Frontend Assets repository instructions

## Repository identity

- 이 저장소는 starter kit이 아니라 공용 frontend 자산 카탈로그다.
- tool-neutral pattern, checklist, example과 script의 canonical source는 `catalog/`다.
- `adapters/`는 특정 coding agent의 trigger와 resource routing만 소유하고 catalog 내용을 복제하지 않는다.

## Change rules

- 새 pattern은 실제 반복 또는 높은 실패 비용을 근거로 추가한다.
- URL state와 local state처럼 사용자 계약이 다른 패턴을 하나의 mode flag API로 합치지 않는다.
- example code를 바꾸면 가까운 test와 관련 catalog 문서를 함께 갱신한다.
- 특정 제품의 endpoint, role, storage key, UI copy와 치수를 canonical catalog에 넣지 않는다.
- 이 저장소의 폴더 구조를 소비 프로젝트의 권장 구조로 표현하지 않는다.

## Verification

변경 후 루트에서 다음을 실행한다.

```bash
bash scripts/check-repository.sh
```

Codex adapter 자체를 수정했고 공식 skill validator가 현재 설치에 있으면 다음도 실행한다.

```bash
bash adapters/codex/scripts/check-skills.sh
```
