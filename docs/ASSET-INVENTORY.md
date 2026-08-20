# 자산 목록과 이식 판단

## 가져온 자산

| 분류         | 자산                                       | 다듬은 점                                                                            |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| 상시 지침    | React SPA용 AGENTS 템플릿                  | 제품·도메인 경로와 조직 용어를 제거하고 책임 경계만 남김                             |
| Feature 구현 | URL 목록 상태                              | URL을 확정 상태로 두고 입력 draft·IME·page reset을 분리                              |
| 서버 연동    | query key, API adapter, mutation           | transport, runtime parsing, query options, invalidation 책임을 분리                  |
| 인증         | token store와 API client                   | 저장소를 주입 가능하게 만들고 동시 401 refresh를 single-flight로 고정                |
| 폼           | React Hook Form 예제와 draft guard         | reset identity, 실패 후 draft 보존, root server error를 테스트로 고정                |
| UI 상태      | error boundary와 query view state          | initial loading, background error, empty, fatal render error를 서로 다른 경계로 분리 |
| Tooling      | ESLint, Prettier, TypeScript, Vite, Vitest | 특정 파일 예외와 라이브러리별 강제 chunk를 제거하고 최소 baseline으로 정리           |
| Workflow     | review, verification, bundle, skill review | 제품명을 제거하고 target 프로젝트의 AGENTS/scripts를 먼저 읽도록 일반화              |

## 의도적으로 제외한 것

- 제품 고유 query-key root, storage key, event name, endpoint, role, 오류 문구
- 특정 UI kit의 class, table column, skeleton 치수, 최소 viewport 수치
- 특정 heavy dependency 이름을 전제로 한 Vite chunk group
- 특정 개발 서버 script, backend 동시 기동, 배포 환경 파일
- 관리형 전역 skill의 복사본. 설치 원본과 업데이트 경로가 갈라지므로 카탈로그만 유지한다.
- 아직 한 번만 나타난 feature-local 추상화와 미래 사용을 예상한 범용 wrapper

## 채택 원칙

1. 먼저 대상 프로젝트의 package version과 기존 책임 경계를 확인한다.
2. 같은 문제가 두 화면 이상에서 반복되거나, 인증·데이터 손실처럼 경계 오류 비용이 큰 경우에만 공용 자산을 채택한다.
3. 코드 예제는 API 계약이 아니라 책임 분리 예시다. endpoint, schema, token 보관 정책은 대상 시스템에 맞게 바꾼다.
4. 한 번에 전부 설치하지 않는다. 필요한 module과 그 테스트를 함께 가져간다.
