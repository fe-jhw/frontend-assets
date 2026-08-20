# Skill Trigger

호출 전에는 `name`과 `description`만 보인다고 가정한다.

좋은 description은 다음을 한 문장에 담는다.

- WHAT: 리뷰, 검증, 생성, 진단처럼 실제 행동
- WHEN: 사용자 요청어, 파일 범위, 변경 시점
- EXCLUSION: 가까운 다른 skill과 겹치는 핵심 제외 범위

대표 요청어 3~6개는 자연스러운 문장 안에 둔다. keyword를 과하게 나열해 모든 frontend 요청을 가로채지 않는다.

충돌을 평가할 때는 두 skill의 description만 나란히 놓고 같은 요청에서 둘 다 필수인지 본다. 항상 함께 호출된다면 하나의 workflow로 합치거나 상위 AGENTS/reference로 옮길 후보다.

상시 원칙은 description을 넓혀 해결하지 않는다. AGENTS로 옮긴다.
