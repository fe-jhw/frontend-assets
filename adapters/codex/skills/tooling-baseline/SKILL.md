---
name: tooling-baseline
description: "React TypeScript 프로젝트의 ESLint flat config, Prettier, strict TypeScript, Vite alias, Vitest setup 또는 build 검사 baseline을 새로 구성하거나 정리할 때 사용한다. feature 로직 구현이나 일반 코드 리뷰에는 사용하지 않는다."
---

# Tooling Baseline

대상 프로젝트의 기존 스타일과 설치 버전을 보존하면서 최소 tooling baseline을 구성한다.

## Workflow

1. package manager, lockfile, 설치된 compiler·lint·build tool version과 기존 script를 확인한다.
2. [Tooling baseline](../../../../catalog/patterns/tooling.md)에서 현재 도구에 해당하는 section만 적용한다.
3. alias와 module resolution처럼 여러 설정 파일이 공유하는 계약을 함께 확인한다.
4. format check, typecheck, lint, test와 production build를 대상 프로젝트 명령으로 실행한다.

## Reference code

[`react-spa-foundation`](../../../../catalog/examples/react-spa-foundation)의 config는 조합 예시다. 기존 style 값과 project-specific exception을 기준으로 필요한 파일만 비교한다.

## Invariants

- 설치된 major version에서 지원되는 option만 사용한다.
- formatter와 lint 충돌 방지 설정은 실제 config 순서로 검증한다.
- manual chunk와 import boundary는 측정되거나 안정된 구조가 있을 때만 추가한다.
- 특정 프로젝트의 dev server, backend 기동과 배포 환경을 공용 baseline에 넣지 않는다.
