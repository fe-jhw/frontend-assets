# 검증 위험도

## Copy-only

짧은 사용자 노출 문구만 바뀌고 DOM, class, 조건, event, route, API가 그대로면 diff check와 가까운 정확한 문구 assertion만 확인한다. 긴 무공백 문자열, 보안·법적 문구, 고정 폭 control이면 behavior/layout 단계로 올린다.

## Level 0: 문서와 하네스

Markdown link, frontmatter, config syntax, 제공되는 structure checker를 실행한다.

## Level 1: 순수 로직과 data layer

format, typecheck, lint, 관련 unit test를 실행한다. parser, query key, normalization은 valid/invalid matrix를 확인한다.

## Level 2: UI behavior

Level 1에 전체 project check와 runtime browser를 추가한다. route, URL, form, list interaction, focus, keyboard, 성공·실패 흐름을 실제로 실행한다.

## Level 3: Layout와 loading surface

Level 2에 screenshot 또는 필요한 DOM rect 측정을 추가한다. skeleton과 final UI, empty/error surface, 최대 page size, overflow, scroll ownership을 비교한다.

## Build 조건

Vite/Next config, dependency, route lazy import, chunk, asset, environment define, 배포 산출물에 영향이 있을 때 실행한다. 단순 source logic 변경의 routine gate로 강제하지 않는다.
