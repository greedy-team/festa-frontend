## 제목

🔧 [설정][유닛테스트] discoveryLabel_publishBlockerLabel 테스트 추가

## 본문

## 🔍 현재 문제점

- `adminEnums.ts`의 `discoveryLabel`/`publishBlockerLabel`은 관리자 화면에서 열거값을 라벨로 바꾸는 함수인데 유닛테스트가 없다
- `publishBlockerLabel`은 서버가 프론트가 모르는 사유를 보낼 수 있어(`PublishFailure.reason`이 string 고정) 폴백이 선택이 아니라 필수라고 주석에 적혀 있는데, 이 경로가 검증되지 않았다
- DOC-0007 #24에 따르면 ERD의 `PASTED` 값과 API 명세(3종)가 불일치한 상태로 남아 있어, `discoveryLabel`의 폴백(사전에 없는 값을 원본 그대로 보여주는 것)이 실제로 쓰일 가능성이 있다

## 💡 해결 방안 / 제안 기능

- `discoveryLabel`: 3종(SITEMAP/MANUAL/SEARCH) 매핑과 사전에 없는 값(예: `PASTED`) 폴백을 검증한다
- `publishBlockerLabel`: 2종(LINEUP_EMPTY/HOST_NOT_LINKED) 매핑과 미정의 사유 폴백을 검증한다

## 🔧 작업 내용

- [ ] `discoveryLabel` 3종 매핑 확인
- [ ] `discoveryLabel` 미정의 값(`PASTED` 등) 폴백 확인
- [ ] `publishBlockerLabel` 2종 매핑 확인
- [ ] `publishBlockerLabel` 미정의 사유 폴백 확인

## 👤 담당자

- 담당: 이름
