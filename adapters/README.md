# Agent Adapters

Adapter는 특정 coding agent가 `catalog/`의 자산을 발견하고 적용하도록 돕는 얇은 통합층이다. frontend 패턴과 코드의 canonical source는 아니다.

- [Codex](codex/README.md)

다른 도구를 추가할 때는 그 도구가 요구하는 instruction/metadata만 두고 catalog 내용을 복사하지 않는다.

## Adapter 채택 계약

Adapter는 단독 설치 package가 아니다. 실제 프로젝트에 적용할 때는 다음 경계를 유지한다.

1. 사용자 의도와 맞는 workflow만 고른다.
2. workflow가 가리키는 pattern, reference module과 가까운 test를 함께 확인한다.
3. catalog 상대 경로를 대상 프로젝트의 문서 또는 project-local 경로로 다시 연결한다.
4. endpoint, schema, UI component, 검증 명령은 대상 프로젝트가 소유한다.
5. 다른 agent 형식을 추가해도 canonical 규칙은 `catalog/`에서만 수정한다.

따라서 `adapters/<tool>/skills/*`만 복사해 링크가 끊긴 상태로 배포하거나, adapter 본문에 catalog 규칙을 다시 적지 않는다.
