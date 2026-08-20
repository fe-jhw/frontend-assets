---
name: frontend-skill-review
description: "프로젝트의 Codex AGENTS, references, hooks/config와 .agents/skills를 평가·생성·수정·삭제할 때 사용한다. frontmatter, trigger, 반복 workflow의 존재 가치, resource 구조, metadata, safety, stale link, 규칙 중복을 점검하며 앱 코드 리뷰에는 사용하지 않는다."
---

# Frontend Skill Review

프로젝트 하네스와 skill이 실제 작업을 올바르게 유도하는지 평가하고, 요청받은 경우 canonical 책임을 유지하며 개선한다.

## 범위

- project-local `AGENTS.md`, `.codex/references`, hooks/config, `.agents/skills`
- 제외: 외부 package/plugin이 제공하는 managed skill과 앱 코드 품질
- 평가만 요청받으면 파일을 수정하지 않는다.

## Reference routing

- 전체 평가에서는 [rubric.md](references/rubric.md)를 모두 읽는다.
- skill과 AGENTS/reference 중 어디에 둘지 판단할 때 [ownership.md](references/ownership.md)를 읽는다.
- trigger 충돌과 description을 고칠 때 [triggers.md](references/triggers.md)를 읽는다.

## 절차

1. 대상 `SKILL.md`, `agents/openai.yaml`, references, scripts와 이를 가리키는 AGENTS/index를 읽는다.
2. deterministic 검사를 먼저 실행한다.

```bash
python3 scripts/check_skill_structure.py <skill-dir-or-skills-root>
```

3. script 결과와 별개로 존재 가치, WHAT/WHEN, trigger overlap, body 유용성을 rubric으로 판단한다.
4. AGENTS의 상시 규칙을 되풀이하는 skill과 Codex 기본 능력만 적은 skill은 보강보다 삭제를 먼저 검토한다.
5. 수정 요청이면 body만 고치지 않고 description, metadata, reference link, script와 소비 문서를 함께 맞춘다.
6. 수정 후 structure checker와 설치 환경의 `skill-creator/quick_validate.py`를 skill별로 실행한다.

## 보고

- deterministic finding과 의미 판단 finding을 구분한다.
- BLOCKER, MAJOR, MINOR 순서로 근거와 수정 방향을 쓴다.
- 유지, 수정, 통합, 삭제 중 결론을 낸다.
- 전체 평가가 아니면 등급을 붙이지 않는다.
