## 제목

🔧 [설정][라인업] LineupArtist 판별자를 revealed에서 id로 교체 (DEC-0116)

## 본문

## 🔍 현재 문제점

- `LineupArtist` 유니온이 `revealed`를 판별자로 쓴다. 머지된 백엔드 축제 상세 응답(`GET /festivals/{id}`)의 라인업 아티스트는 `id`·`name`·`imageUrl`·`genre` 4필드뿐이고 `revealed`를 내지 않는다. 시크릿 게스트는 네 필드가 모두 null인 원소로 온다.
- `NEXT_PUBLIC_API_MOCKING=false`로 전환해 실 응답을 받는 순간 `artist.revealed`가 전부 undefined(falsy)가 되어, `LineupSheet`와 `DayCard`의 분기가 모두 else로 떨어진다 — 공개된 아티스트까지 전부 회색 "공개 예정" 자리로 렌더된다.
- 지금은 mock이 `revealed`를 넣어줘서 드러나지 않고, 백엔드 `GET /festivals/{id}`(#83)도 아직 미배포라 실제로 깨진 화면은 없다. 실 API 연동 전에 반드시 정리해야 하는 항목이다.
- 근거: festa-brain 볼트 DEC-0116 (시크릿 게스트는 artist null로만 표현하고 revealed를 응답에 두지 않는다). #132(order 필드 제거, DEC-0109)와 같은 파일 같은 5줄에서 나온 파생값 제거 쌍이라, 하나만 처리하면 다음 연동 때 같은 자리를 다시 건드리게 된다.

## 💡 해결 방안 / 제안 기능

- `LineupArtist` 유니온의 판별자를 `revealed`에서 `id`로 바꾼다. id가 null이면 시크릿 게스트, 아니면 공개 아티스트.
- 시크릿 게스트 원소의 자리는 그대로 유지한다 (라인업 규모가 보여야 한다 — ISS-0057에서 확정).
- 목 픽스처·목 핸들러에서 `revealed` 필드를 제거해 실제 응답 계약과 맞춘다.
- 영향 범위: 축제 상세 화면의 전체 라인업 시트와 day 카드. 외부 동작 변경 내용: 없음 (화면 출력은 동일, 실 API 연동 시 정상 렌더되도록 계약 정합만 맞춘다).

## 🔧 작업 내용

- [ ] `src/features/festivals/types.ts`: `LineupArtist` 유니온 판별자를 `revealed` → `id`로 교체, `revealed` 필드 제거
- [ ] `src/features/festivals/components/LineupSheet.tsx`: `artist.revealed` 분기를 `artist.id != null` 기준으로 교체
- [ ] `src/features/festivals/components/DayCard.tsx`: `artist.revealed` 분기를 `artist.id != null` 기준으로 교체
- [ ] `src/mocks/fixtures/db.ts`: 라인업 픽스처에서 `revealed` 필드 제거 (`artistId` null 여부로 판별)
- [ ] `src/mocks/handlers/festivals.ts`: `GET /festivals/:id` 응답에서 `revealed` 필드 제거
- [ ] 라인업 시트·day 카드에서 시크릿 게스트 자리가 유지되는지 확인

## 👤 담당자

- 담당: 이름
