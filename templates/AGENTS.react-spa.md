# React SPA 작업 지침 템플릿

아래 내용은 시작점이다. 실제 폴더와 package script를 확인한 뒤 존재하는 계약만 프로젝트 `AGENTS.md`에 남긴다.

## 행동 원칙

- 기존 사용자 변경과 무관한 파일을 되돌리거나 일괄 정리하지 않는다.
- 추측성 fallback, 미래용 확장점, 한 번만 쓰는 범용 추상화를 추가하지 않는다.
- 잘못된 상태를 기본값으로 숨기지 말고 입력·schema·API 경계에서 드러낸다.
- UI 동작이나 layout 계약을 바꾸면 실제 브라우저에서 영향받은 흐름을 확인한다.

## 구조와 import 방향

- app 진입점은 provider와 router 조립만 담당한다.
- route 계층은 route 정의, lazy/Suspense/error boundary, shell metadata를 담당한다.
- feature는 화면과 그 화면 전용 component·test·skeleton을 소유한다.
- API 계층은 domain별 transport, runtime schema, query key, query/mutation option을 소유하고 UI를 import하지 않는다.
- 공용 component와 hook은 feature를 import하지 않는다.
- 여러 feature가 공유하는 도메인 UI와 도메인을 모르는 공용 UI를 구분한다.

## 데이터와 목록

- 서버 상태는 TanStack Query가 소유하고 query key는 domain별 factory에서 생성한다.
- 공유·새로고침·뒤로가기가 의미 있는 목록 상태는 URL search params가 canonical source다.
- 검색 입력 draft와 URL에 확정된 query를 분리하고, 한글 IME 조합 중 Enter는 submit으로 처리하지 않는다.
- search, filter, page size 변경은 page를 1로 되돌린다. 잘못된 URL 값은 명시적으로 정규화한다.
- refetch 중 기존 데이터가 있으면 목록을 지우지 않는다. initial loading과 background fetching을 구분한다.

## 폼과 draft

- page wrapper는 query, mutation, navigation을 소유하고 form은 draft, validation, submit 진입을 소유한다.
- form identity가 바뀔 때만 reset한다. 동일 entity refetch, pending, 실패에서는 dirty draft를 보존한다.
- 단일 field가 해결할 수 없는 권한·네트워크·관계 오류는 root 또는 form-level 오류로 표시한다.
- schema, disabled 상태, submit guard, DTO가 같은 valid-state matrix를 표현해야 한다.
- 저장 전 이동 가능한 화면은 route 이동, 내부 전환, beforeunload를 같은 dirty 정책으로 보호한다.

## 인증과 API client

- 외부 응답은 `unknown`으로 받은 뒤 schema 경계에서 검증한다.
- API base URL을 붙이는 내부 요청과 이미 완성된 외부 URL 요청을 구분한다.
- 동시 401 refresh는 single-flight로 합치고 원 요청은 최대 한 번만 재시도한다.
- 이전 세션의 늦은 응답이 새 세션을 덮지 않도록 session generation 또는 동등한 guard를 둔다.
- token 저장 정책은 위협 모델에 맞춰 정한다. 가능하면 httpOnly cookie/BFF를 우선하고 브라우저 저장소 예제는 명시적 선택으로만 채택한다.

## 오류·로딩·빈 상태

- 앱/route render error, query initial error, section error, mutation error를 같은 fallback 하나로 처리하지 않는다.
- `data 없음 + pending`, `data 없음 + error`, `data 있음 + background error`, empty를 구분한다.
- 화면 구조를 바꾸면 가까운 skeleton, error, empty state의 같은 slot과 높이도 함께 점검한다.
- route error reset은 pathname과 Query error reset을 함께 고려한다.

## Tooling과 검증

- 기본 검증 순서는 format check, typecheck, lint, test다.
- build는 Vite config, dependency, asset, lazy split, 배포 산출물에 영향이 있을 때 실행한다.
- ESLint와 Prettier 충돌을 막기 위해 `eslint-config-prettier`를 flat config 마지막에 둔다.
- 일회성 lint 예외는 파일 전체가 아니라 가장 좁은 범위와 이유로 제한한다.
- form, URL, auth refresh, error boundary는 성공 예시뿐 아니라 상태 전이와 실패 matrix를 테스트한다.
