# Pattern 검증 Matrix

## URL 목록

- direct URL, 뒤로가기, 새로고침
- invalid page/size/filter 정규화와 history replace
- 검색 submit, clear, 한글 IME Enter
- query/filter/size 변경 시 page reset
- page 보정 시 history 추가 없음

## Query와 UI 상태

- initial pending, initial error, empty, ready
- data가 있는 refetch와 refetch error
- mutation 성공 invalidation과 실패 뒤 화면 보존

## 인증

- 동시 401에서 refresh 한 번
- 늦은 401이 새 token으로 재시도
- refresh 실패와 repeated 401에서 session 만료
- logout/new login 뒤 이전 refresh 결과 무시
- 내부 path와 외부 absolute URL 분리

## 폼

- empty, valid, field error, root server error
- pending 중 중복 제출 차단
- 실패 뒤 draft 보존
- 동일 entity refetch와 다른 entity 전환
- route/internal transition/beforeunload dirty guard

## 브라우저

UI 동작을 바꾸면 실제 route에서 keyboard, focus, URL, console을 확인한다. skeleton/list layout을 바꾸면 지원 viewport에서 scroll과 layout shift도 확인한다.
