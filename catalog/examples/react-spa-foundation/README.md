# React SPA Foundation Example

URL 목록 상태, local pagination, query/API 경계, 인증 refresh, form draft, error boundary를 하나의 작은 package에서 타입체크하고 테스트한다. publish용 library나 starter가 아니라 필요한 module과 test를 함께 읽고 선별 채택하는 reference다.

## 기준 버전

- React 19
- React Router 7
- TanStack Query 5
- React Hook Form 7
- Zod 4
- Vite 8 / Vitest 4 / ESLint 10 / TypeScript 6

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
```

## 가져갈 때

1. 대상 프로젝트 dependency major를 확인한다.
2. [목록 상태 선택 기준](../../patterns/list-state-selection.md)처럼 관련 pattern을 먼저 읽는다.
3. 필요한 폴더와 가까운 `*.test.*`를 함께 참고한다.
4. alias, endpoint, schema, error copy, UI component를 대상 프로젝트에 맞춘다.
5. browser storage token store는 인증 architecture가 명시적으로 허용할 때만 사용한다.
