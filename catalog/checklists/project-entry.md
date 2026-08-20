# 프로젝트 진입 체크리스트

새 프로젝트를 시작하거나 기존 프로젝트에 처음 들어갈 때, 구현 전에 현재 계약과 필요한 catalog 자산을 좁히기 위한 점검표다. 이 저장소 전체를 적용하는 설치 목록이 아니며 현재 작업과 관련된 항목만 사용한다.

## 작업 경계

- [ ] 새 프로젝트인지 기존 프로젝트인지 구분했다.
- [ ] 이번 작업의 사용자 흐름, acceptance criteria와 변경하지 않을 동작을 적었다.
- [ ] 저장소 지침, 현재 변경 사항, 코드 소유 경계와 검증 명령을 확인했다.
- [ ] frontend만 바꾸는지 API, 인증, 배포 환경과 함께 바꾸는지 구분했다.

## 기존 프로젝트에 들어갈 때

- [ ] package manager, lockfile, runtime·framework major와 실제 실행 script를 확인했다.
- [ ] router, query/cache, form, auth, API client와 error boundary의 현재 owner를 찾았다.
- [ ] `.env.example`과 config에서 필요한 환경 변수 이름, API base URL, proxy/mock 경계를 확인했다. 비밀값은 문서나 catalog에 옮기지 않는다.
- [ ] Figma, Storybook, component library, token, CSS variable와 유사 화면 중 현재 프로젝트의 시각 기준을 찾았다.
- [ ] 지원 browser·viewport, 접근성 기준과 배포 산출물 계약을 확인했다.
- [ ] 기존 formatter, lint, typecheck, unit/browser test와 build 명령을 먼저 실행하거나 현재 실패 상태를 기록했다.

## 새 프로젝트를 시작할 때

- [ ] package manager, runtime, framework, router, build와 test 도구의 선택 근거를 적었다.
- [ ] 사용할 design source·component system·token owner를 정하고 소비 프로젝트의 결정으로 기록했다.
- [ ] API 계약, 실제 server와 dummy/mock의 경계, auth architecture와 browser storage 사용 여부를 정했다.
- [ ] 지원 browser·viewport, keyboard/focus와 접근성 acceptance criteria를 정했다.
- [ ] format, typecheck, lint, unit test, 필요한 browser test와 production build 명령을 마련했다.

## Catalog 자산을 고를 때

- [ ] 현재 실패 비용이나 상태 소유권 문제에서 시작해 관련 pattern 하나를 먼저 읽었다.
- [ ] 대상 dependency major를 [호환성 기준](../COMPATIBILITY.md)과 비교했다.
- [ ] 필요한 module·test·설정 일부를 채택 단위로 골라 대상 프로젝트의 기존 구조와 UI에 연결했다.
- [ ] endpoint, schema, query-key root, storage 정책, 문구와 UI component를 대상 프로젝트 계약에 맞게 바꿨다.
- [ ] 가져오지 않은 자산과 그 이유를 기록해 불필요한 공용화를 피했다.

## 반복 workflow 조립 순서

### Tooling

- [ ] 기존 script와 config 확인 → 누락된 gate 선택 → 가장 좁은 config 병합 → format/type/lint/test/build 검증 순서로 진행한다.

### Auth와 API client

- [ ] auth architecture·storage 결정 → token store → API client와 refresh → session/profile owner → protected route → logout/cache 정리 순서로 조립한다.
- [ ] 동시 401, 늦은 401, refresh 실패와 logout/new login race를 확인한다.

### 목록

- [ ] URL 또는 local owner 선택 → 값 정규화와 page reset → query key/request params → response parsing → loading/error/empty/ready surface → pagination 순서로 조립한다.
- [ ] direct entry, 새로고침, 뒤로가기와 refetch 상태를 실제 route에서 확인한다.

### 폼

- [ ] form identity와 server mapping → async default/reset → draft guard → validation·helper/error → mutation·server error → 성공 뒤 clean/navigation 순서로 조립한다.
- [ ] 같은 entity refetch, 다른 entity 전환, 실패 뒤 draft와 중복 제출을 확인한다.

### UI 상태

- [ ] final surface의 header, toolbar, body, action/footer slot을 먼저 확인했다.
- [ ] pending, empty, error와 background refetch가 같은 구조와 scroll ownership을 유지하는지 비교했다.

## 폼과 접근성 통합

- [ ] 나란한 field는 helper/error 한 줄 공간을 같은 높이로 확보해 validation 전후 grid row가 움직이지 않는다.
- [ ] field error를 label/control과 `aria-describedby`로 연결하고 첫 invalid field 또는 form-level error로 focus를 이동한다.
- [ ] custom discard prompt는 modal semantics, accessible name/description, initial focus, Tab containment, Escape와 이전 focus 복원을 제공한다.
- [ ] keyboard, focus indicator, control name, overflow와 responsive reflow를 실제 browser에서 확인한다.

## 종료 증거

- [ ] 적용한 catalog 자산과 소비 프로젝트에서 바꾼 계약을 기록했다.
- [ ] 위험도에 맞는 검증 결과와 기존 실패를 구분해 남겼다.
- [ ] layout/loading 변경이면 skeleton/final, pristine/error와 empty/error surface를 screenshot 또는 DOM rect로 비교했다.
- [ ] 남은 가정, 의도적으로 제외한 범위와 후속 결정을 기록했다.
