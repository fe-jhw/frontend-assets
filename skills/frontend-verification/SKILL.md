---
name: frontend-verification
description: "React 프론트엔드 변경을 verify, test, 실제 화면, 브라우저, console 관점에서 검증할 때 사용한다. 변경 위험도에 따라 format/type/lint/test/build와 runtime UI 범위를 선택하며, 검증만 요청받은 경우 파일을 수정하지 않는다."
---

# Frontend Verification

대상 프로젝트의 명령과 acceptance criteria를 우선하고, 이 skill은 검증 깊이 선택과 runtime 확인을 담당한다.

## 절차

1. diff를 보고 copy-only, docs/harness, logic, behavior, layout 중 위험도를 고른다.
2. `AGENTS.md`, 관련 reference, `package.json` scripts에서 실제 검증 명령을 확인한다.
3. 가장 작은 관련 test부터 실행한 뒤 프로젝트 기본 check로 확장한다.
4. dependency, build config, asset, lazy split에 영향이 있을 때 build를 실행한다.
5. UI behavior, route, form, list, browser-only API 변경은 실제 브라우저에서 검증한다.
6. 실패하면 사용자가 수정을 함께 맡긴 경우에만 원인을 고치고 같은 검증을 재실행한다.

위험도와 runtime checklist는 [risk-levels.md](references/risk-levels.md)를 읽는다.

## 원칙

- 이미 실행 중인 local server를 먼저 확인하고 재사용한다.
- 사용자 로그인이나 확장 상태가 필요한지에 따라 브라우저 도구를 선택한다.
- 기존 사용자 탭을 바꾸지 않고 별도 검증 session을 사용한다.
- static code 확인으로 필요한 UI runtime 검증을 대체하지 않는다.
- 검증만·수정 금지 요청이면 formatter도 write mode로 실행하지 않는다.

## 보고

- 실행한 command와 pass/fail
- 확인한 route, user flow, viewport assumption
- console error 유무
- 실행하지 못한 검증과 구체적인 blocker
- 생략한 검증이 있으면 위험도 판단과 이유
