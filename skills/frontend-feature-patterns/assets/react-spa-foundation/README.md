# React SPA Foundation Example

URL 목록 상태, query/API 경계, 인증 refresh, form draft, error boundary를 하나의 작은 package에서 타입체크하고 테스트한다. publish용 library가 아니라 필요한 module과 test를 함께 복사하는 reference다.

## 기준 버전

- React 19
- React Router 7
- TanStack Query 5
- React Hook Form 7
- Zod 4
- Vite 8 / Vitest 4 / ESLint 10 / TypeScript 6

## 폴더

- `src/url-list-state`: URL canonical state와 검색 draft
- `src/query`: query key와 UI state 분기
- `src/api-client`: 내부 API transport와 외부 URL 분리
- `src/auth`: token schema와 generation-aware store
- `src/api/items`: generic domain의 API/query/mutation 예제
- `src/form-draft`: dirty 이동 보호와 reset
- `src/error`: reset 가능한 render error boundary
- `src/features/items`: 목록과 React Hook Form 조립 예제

## 실행

```bash
npm install
npm run check
```

## 가져갈 때

1. 대상 프로젝트 dependency major를 확인한다.
2. 필요한 폴더와 가까운 `*.test.*`만 함께 가져간다.
3. alias, endpoint, schema, error copy, UI component를 대상 프로젝트에 맞춘다.
4. browser storage token store는 인증 architecture가 명시적으로 허용할 때만 사용한다.
