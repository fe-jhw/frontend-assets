# Agent Adapters

Adapter는 특정 coding agent가 `catalog/`의 자산을 발견하고 적용하도록 돕는 얇은 통합층이다. frontend 패턴과 코드의 canonical source는 `catalog/`다.

- [Codex](codex/README.md)

다른 도구를 추가할 때는 그 도구가 요구하는 instruction/metadata와 canonical catalog 링크를 둔다.

## Adapter 채택 계약

실제 프로젝트의 채택 단위는 adapter와 adapter가 가리키는 catalog 자산이다.

1. 사용자 의도와 맞는 workflow만 고른다.
2. workflow가 가리키는 pattern, reference module과 가까운 test를 함께 확인한다.
3. catalog 상대 경로를 대상 프로젝트의 문서 또는 project-local 경로로 다시 연결한다.
4. endpoint, schema, UI component, 검증 명령은 대상 프로젝트가 소유한다.
5. 다른 agent 형식을 추가해도 canonical 규칙은 `catalog/`에서만 수정한다.

배포할 때는 `adapters/<tool>/skills/*`와 연결된 pattern, reference module과 test의 접근 경로를 함께 유지한다. canonical 규칙 수정은 `catalog/`에서 수행한다.
