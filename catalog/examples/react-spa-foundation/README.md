# React SPA Foundation Example

URL 목록 상태, local pagination, query/API 경계, 인증 refresh, form draft, error boundary를 하나의 작은 package에서 타입체크하고 테스트하는 reference다.

## 기준 버전

[호환성 기준](../../COMPATIBILITY.md)을 단일 원본으로 사용한다. 이 package의 lockfile과 CI 결과가 실제 설치 버전의 근거다.

## 폴더

- `src/url-list-state`: 공유·복원 가능한 URL canonical state와 pagination
- `src/local-list-state`: component 생명주기 안의 local pagination
- `src/pagination`: 두 방식이 공유하는 순수 값 정규화
- `src/query`: query key와 UI state 분기
- `src/api-client`: 내부 API transport와 외부 URL 분리
- `src/auth`: token schema와 generation-aware store
- `src/api/items`: generic domain의 API/query/mutation 예제
- `src/form-draft`: data router 기반 dirty 이동 보호와 reset
- `src/error`: reset 가능한 render error boundary
- `src/features/items`: 목록과 React Hook Form 조립 예제

## 실행

```bash
npm install
npm run check
npx playwright install chromium
npm run test:browser
```

## 가져갈 때

1. 대상 프로젝트 dependency major를 확인한다.
2. [목록 상태 선택 기준](../../patterns/list-state-selection.md)처럼 관련 pattern을 먼저 읽는다.
3. 필요한 폴더와 가까운 `*.test.*`를 함께 참고한다.
4. alias, endpoint, schema, error copy, UI component를 대상 프로젝트에 맞춘다.
5. browser storage token store는 인증 architecture가 명시적으로 허용할 때만 사용한다.

## 채택 단위

필요한 module과 가까운 test를 한 단위로 보고 소비 프로젝트의 기존 구조, UI와 제품 계약에 맞게 이식한다. generic UI markup은 상태 전이와 접근성 연결을 실행하는 데 사용한다.

여러 module을 함께 채택할 때는 [프로젝트 진입 체크리스트](../../checklists/project-entry.md)의 workflow별 조립 순서와 대상 프로젝트의 기존 owner를 우선한다.
