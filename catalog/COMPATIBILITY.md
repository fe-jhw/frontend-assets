# Compatibility

이 표는 현재 reference package를 2026-08-20에 검증한 version snapshot이다. major upgrade는 대상 프로젝트의 결정과 재검증을 거쳐 반영한다.

| 영역 | 검증 기준 |
| --- | --- |
| React | 19 |
| React Router | 7, data router 사용 예제 |
| TanStack Query | 5 |
| React Hook Form | 7 |
| Zod | 4 |
| Vite | 8 |
| Vitest | 4 |
| Playwright | 1 |
| ESLint | 10 |
| TypeScript | 6 |

lockfile과 CI 결과가 실제 설치 버전의 근거다. `npm outdated`의 최신 major는 이 표를 낡은 것으로 판정하는 근거가 아니며, 같은 major의 wanted update와 보안 결과를 우선 확인한다. 다른 major에서 자산을 채택할 때는 public API, router mode, compiler option과 test 결과를 별도로 확인한다.
