## 제목

🔧 [설정][유닛테스트] isActiveRoute 오탐 경계 테스트 추가

## 본문

## 🔍 현재 문제점

- `activeRoute.ts`의 `isActiveRoute`는 nav 메뉴 활성화 판정에 쓰이는 함수인데 유닛테스트가 없다
- 함수 주석에 이미 `/festivals-archive`가 생기면 `pathname.startsWith(href)`만으로는 `/festivals` 메뉴가 같이 켜지는 오탐 케이스가 적혀 있는데, 이 케이스가 테스트로 고정돼 있지 않다

## 💡 해결 방안 / 제안 기능

- 정확히 일치하는 경로, 하위 경로(`/festivals/12`), 그리고 주석에 적힌 오탐 케이스(`/festivals-archive`가 `/festivals`로 오인되지 않는지)를 검증하는 테스트를 추가한다

## 🔧 작업 내용

- [ ] `pathname === href` 케이스 확인
- [ ] 하위 경로(`${href}/...`) 케이스 확인
- [ ] `/festivals-archive` vs `/festivals`처럼 접두어는 같지만 슬래시 경계가 다른 오탐 케이스 확인

## 👤 담당자

- 담당: 이름
