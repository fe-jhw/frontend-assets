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

## Commits

- 사용자가 commit을 요청했을 때만 생성하고, push·amend·rebase는 별도 요청 없이 수행하지 않는다.
- 기본 형식은 `<type>(<scope>): <summary>`이며 type은 `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`, `revert` 중에서 고른다.
- scope는 폴더명을 기계적으로 옮기기보다 변경 의도를 찾게 해주는 영역을 쓴다. 이 저장소에서는 `catalog`, `pagination`, `auth`, `draft`, `codex`, `example`, `docs`, `ci` 등을 우선한다.
- 같은 의도를 증명하는 test와 문서는 구현과 함께 둘 수 있지만, 무관한 refactor·formatting·문서 정리는 별도 commit으로 나눈다.
- 상세 판단 기준은 `catalog/patterns/commit-policy.md`를 따른다.
