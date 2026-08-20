# 새 React 프로젝트 세팅

## 1. 프로젝트 기준 확인

`package.json`, lockfile, 라우터, 서버 상태, 폼, 인증 방식부터 확인한다. 이 자산의 예제 기준은 React 19, React Router 7, TanStack Query 5, React Hook Form 7, Zod 4, Vite 8이다. 다른 major version이면 API를 그대로 복사하지 않는다.

## 2. 전역 skill 확인

[GLOBAL-SKILLS.md](GLOBAL-SKILLS.md)의 기본 묶음을 확인한다. 전역 skill은 한 번 설치하고 프로젝트에는 사용 조건만 둔다. 팀이 함께 바꾸어야 하는 workflow만 `.agents/skills`에 project-local로 둔다.

```bash
bash scripts/audit-global-skills.sh
```

## 3. 상시 지침 채택

[AGENTS.react-spa.md](../templates/AGENTS.react-spa.md)에서 실제 프로젝트에 맞는 규칙만 루트 `AGENTS.md`로 옮긴다. 존재하지 않는 폴더 구조나 실행하지 않는 검증 명령을 문서에 먼저 선언하지 않는다.

## 4. project-local skill 선택

- 목록·폼·인증 기반 구현이 시작될 때: `frontend-feature-patterns`
- 반복 가능한 코드리뷰 기준이 필요할 때: `frontend-code-review`
- UI runtime 검증을 작업마다 일관되게 할 때: `frontend-verification`
- 번들 크기 요청이 실제로 생겼을 때만: `frontend-bundle-audit`
- skill/reference/hook이 두 개 이상 생겼을 때: `frontend-skill-review`

## 5. 설정 baseline 채택

실행 예제의 `eslint.config.js`, `prettier.config.js`, `tsconfig*.json`, `vite.config.ts`, `src/test/setup-tests.ts`를 비교한다. 설정은 통째로 덮어쓰지 말고 기존 plugin·alias·test environment를 보존하며 합친다.

기본 검증 script는 다음 순서를 권장한다.

```json
{
  "check": "npm run format:check && npm run typecheck && npm run lint && npm run test"
}
```

build는 dependency, Vite config, asset, lazy split, 배포 산출물에 영향이 있을 때 추가한다.

## 6. 첫 기능에서 증명

공통 hook을 미리 전부 넣지 않는다. 첫 실제 목록 또는 폼에 필요한 module과 테스트만 가져오고, 두 번째 소비자가 생길 때 공용 위치를 확정한다.
