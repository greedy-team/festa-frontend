## 제목

🔧 [설정][유닛테스트] safeHttpUrl 스킴 필터링 테스트 추가

## 본문

## 🔍 현재 문제점

- `safeUrl.ts`의 `safeHttpUrl`은 크롤러가 외부 블로그에서 가져온 `sourceUrl`을 `<a href>`에 넣기 전에 `javascript:`/`data:` 등 위험한 스킴을 걸러내는 함수(`FestivalReviewTable.tsx`에서 사용)인데, 현재 유닛테스트가 없다
- XSS와 직결되는 함수라 다른 라벨 매핑 함수들보다 커버리지 우선순위가 높다

## 💡 해결 방안 / 제안 기능

- `admission.ts` 라벨 매핑 테스트와 같은 패턴으로 `safeHttpUrl` 테스트를 추가한다

## 🔧 작업 내용

- [ ] `javascript:` 스킴 차단 확인 (대소문자 포함)
- [ ] `data:` 스킴 차단 확인
- [ ] `//evil.com` 같은 프로토콜 상대 URL 차단 확인
- [ ] 정상 `https://` URL은 그대로 통과하는지 확인

## 👤 담당자

- 담당: 이름
