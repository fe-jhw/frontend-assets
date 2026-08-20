# Skill 품질 Rubric

## 타당성

1. 반복되는 workflow인가?
2. 한 파일이나 한 화면보다 넓게 적용되는가?
3. Codex 기본 능력 또는 AGENTS만으로 대체하기 어려운가?

## 구조

4. YAML frontmatter가 파싱되는가?
5. name이 64자 이하 kebab-case인가?
6. name과 폴더명이 같은가?
7. description이 1~1024자인가?
8. description에 XML/HTML tag가 없는가?
9. frontmatter key가 name과 description뿐인가?
10. skill 폴더에 별도 README가 없는가?

## Trigger

11. description에 WHAT과 WHEN이 있는가?
12. 사용자가 말할 대표 keyword가 있는가?
13. description과 body의 실제 작업이 같은가?
14. 사용 시점이 body에만 숨어 있지 않은가?
15. 다른 skill을 과도하게 가로채지 않는가?
16. 정의되지 않은 argument placeholder에 의존하지 않는가?

## Content

17. 명령, 파일, 판단 이유, 실패 처리 중 구체적인 내용이 있는가?
18. 일반 개발 지식만 되풀이하지 않는가?
19. SKILL body가 500줄 이하인가?

## Resource

20. 핵심 절차는 SKILL, 상세는 reference에 있는가?
21. 각 reference를 언제 읽는지 body에 적혀 있는가?
22. references가 한 단계 깊이로 평평한가?
23. 긴 reference에 탐색 가능한 heading이 있는가?
24. 실수하기 쉬운 결정적 작업이 script로 고정됐는가?
25. script가 문서의 동작과 일치하고 syntax 검사를 통과하는가?
26. asset과 template의 채택 지점이 설명돼 있는가?

## Metadata와 Safety

27. `agents/openai.yaml`의 이름·설명·default prompt가 skill과 동기화됐는가?
28. default prompt가 `$skill-name`을 명시하는가?
29. secret, credential, 민감정보가 없는가?
30. 파괴적 명령, stale link, 미완성 marker가 없는가?

## 판정

- BLOCKER: 호출 또는 안전을 깨는 구조·secret·파괴적 문제
- MAJOR: 존재 가치, trigger, canonical 책임, 핵심 workflow를 깨는 문제
- MINOR: 발견 가능성, 탐색성, metadata, 국소적인 유지보수 문제

BLOCKER가 있으면 F다. 그 외에는 finding 개수보다 실제 호출 가능성과 행동 변화에 근거해 유지·수정·통합·삭제 결론을 낸다.
