# Frontend Assets

React SPA에서 반복해서 참고할 패턴, 체크리스트, 검증 가능한 코드 예제와 agent adapter를 모아두는 카탈로그다. 이 저장소를 통째로 복사해 새 프로젝트를 시작하는 starter kit이 아니며, 대상 프로젝트의 기술 버전과 기존 책임 경계를 확인한 뒤 필요한 자산만 선별한다.

## 구조

| 위치 | 역할 |
| --- | --- |
| [`catalog/`](catalog/README.md) | 특정 AI 도구에 종속되지 않는 canonical 패턴, 체크리스트, 예제와 script |
| [`adapters/`](adapters/README.md) | Codex 등 각 agent가 catalog를 발견하고 적용하도록 돕는 얇은 adapter |
| [`docs/`](docs/ARCHITECTURE.md) | 저장소 구조, 소유권과 채택 방법 |

도구 중립 지식과 실행 코드는 `catalog/`가 소유한다. `SKILL.md`, `AGENTS.md`, tool metadata 같은 형식은 canonical 내용을 복제하지 않고 catalog로 라우팅한다.

## 시작 위치

- 카탈로그 탐색: [catalog/README.md](catalog/README.md)
- URL 상태와 로컬 상태 선택: [catalog/patterns/list-state-selection.md](catalog/patterns/list-state-selection.md)
- 자산 사용 방법: [docs/USING-THE-CATALOG.md](docs/USING-THE-CATALOG.md)
- 구조와 소유권: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Codex adapter: [adapters/codex/README.md](adapters/codex/README.md)

## 검증

```bash
bash scripts/check-repository.sh
npm exec --prefix catalog/examples/react-spa-foundation -- playwright install chromium
npm run test:browser --prefix catalog/examples/react-spa-foundation
```

첫 명령은 catalog 예제의 format/type/lint/unit test/build, Markdown link와 section anchor, adapter 구조와 script syntax를 검사한다. 뒤의 두 명령은 URL history, dirty transition dialog와 form focus를 Chromium에서 확인한다. CI는 browser 설치와 smoke test까지 모두 실행한다. Codex 설치에 포함된 공식 validator가 있으면 `adapters/codex/scripts/check-skills.sh`로 별도 확인할 수 있다.
