# Tooling Baseline

## ESLint

- flat config에서 JavaScript, TypeScript, React Hooks, Vite refresh 권장 설정을 조합한다.
- `eslint-config-prettier`를 마지막에 둔다.
- 특정 파일 예외는 이유가 확인된 rule 하나만 가장 좁게 끈다.
- import boundary는 실제 디렉터리 구조가 안정된 뒤 `no-restricted-imports` 또는 전용 plugin으로 추가한다.

## Prettier

스타일 값보다 팀이 하나의 formatter를 사용하고 CI에서 `prettier --check .`를 실행하는 것이 중요하다. 기존 프로젝트 스타일을 우선하며 예제 preset은 no-semicolon, double quote, width 100 조합을 보여준다.

## TypeScript

`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, bundler resolution을 baseline으로 둔다. 새 TypeScript option은 설치된 compiler version에서 확인한다.

## Vite와 Vitest

- alias는 Vite와 TypeScript 양쪽에서 일치시킨다.
- test setup은 DOM matcher와 cleanup처럼 전 suite 공통인 것만 둔다.
- manual chunk는 baseline에 넣지 않는다. 실제 build와 analyzer에서 원인이 확인된 dependency만 분리한다.
- build는 typecheck와 별도로 배포 산출물 계약을 확인한다.
