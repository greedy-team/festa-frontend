### 📌 작업 개요

라인업 아티스트 데이터에서 `order` 필드를 제거한다. 백엔드 결정 DEC-0109이 이
필드를 응답에 두지 않기로 정했고 — 배열 순서 자체가 계약이며 순번 표기는 프론트가
인덱스로 만든다 — 프론트 타입·목데이터·목 핸들러를 그 계약에 맞춰 미리 정리했다.

백엔드 `GET /festivals/{id}`(#83)는 아직 미구현이라 실제 응답과의 드리프트는 없다.

### 🎯 구현 목표

- `LineupArtist` 타입에서 `order: number` 제거
- 전체 라인업 바텀시트의 순번 표기를 서버 값 대신 배열 인덱스로 전환
- 목 픽스처·목 핸들러에서 `order` 필드 제거해 실제 계약과 일치시키기
- 화면에 보이는 순번·나열 순서·아티스트 정보는 그대로 유지

### ✅ 구현 내용

#### 라인업 아티스트 타입에서 order 제거

- **파일**: `src/features/festivals/types.ts`
- **변경 내용**: `LineupArtist`를 `{ order: number } & (판별 유니온)` 형태에서
  `order`를 뺀 순수 판별 유니온으로 정리
- **이유**: DEC-0109에 따라 `order`는 응답 계약에서 빠진다. `revealed`로
  갈리는 판별 유니온 구조는 그대로 두고 교집합 부분만 제거

#### 전체 라인업 시트 순번 표기 방식 변경

- **파일**: `src/features/festivals/components/LineupSheet.tsx`
- **변경 내용**: 순번 `<span>`의 값을 `{artist.order}` → `{i + 1}`
- **이유**: 이미 `map((artist, i) => ...)`에 존재하던 인덱스를 재사용한다.
  새 상태·새 계산 없이 표현식 한 곳만 바뀐다

#### 목 픽스처에서 order 제거

- **파일**: `src/mocks/fixtures/db.ts`
- **변경 내용**: `LineupArtist` 내부 픽스처 타입에서 `order: number` 제거,
  `festivalsDb`의 라인업 항목에서 `order` 값 삭제 (연세대 day1: 1~4,
  day2: 1 / 성균관대 / 고려대)
- **이유**: 픽스처의 나열 순서 자체가 순서다. 기존 `order` 값이 배열 위치와
  정확히 일치했으므로(day1: 1,2,3,4) 화면 출력은 동일하다

#### 목 핸들러 응답에서 order 제거

- **파일**: `src/mocks/handlers/festivals.ts`
- **변경 내용**: `GET /festivals/:id` 응답 조립에서 `revealed` 분기 양쪽의
  `order: a.order` 제거
- **이유**: 목 응답을 실제 백엔드 계약과 맞춘다

### 🧭 결정 기록 (ADR)

해당 없음 — 백엔드 결정 DEC-0109를 프론트에 반영한 작업이다. 구현 중 별도로
고른 선택지는 없다.

### 🔧 주요 변경사항 상세

#### 삭제 자리마다 남긴 why-주석

`types.ts`·`LineupSheet.tsx`·`db.ts`·`festivals.ts` 네 곳 모두 `order`를 지운
자리에 `DEC-0109` id를 박은 주석을 남겼다. 삭제 PR에서 가장 흔한 재발(다음
사람이 "왜 없지?" 하며 필드를 되살림)을 막기 위한 것이다.

**특이사항**:
- 시크릿 게스트 행의 key(`artist.id ?? secret-${i}`)는 건드리지 않았다 —
  `artistId: null` 행이 자리를 그대로 유지한다
- 아티스트 나열 순서·개수는 원래도 `order` 값이 아니라 배열 순서를 따르고
  있었다. `order`로 정렬하는 코드는 없었다

### 📦 의존성 변경

없음

### 🧪 테스트 및 검증

- `pnpm exec tsc --noEmit` 통과
- `pnpm lint` 통과 (무관한 기존 warning 1건 제외 — `public/mockServiceWorker.js`)
- `pnpm test` 55개 통과
- `pnpm build` 통과
- 잔존 `order` 참조 스윕 0건 (`src/`·`e2e/`·`docs/`·`.github/`,
  `border`·`SECTION_ORDER` 오탐 제외)
- 축제 상세 화면 "전체 라인업 보기" 시트 육안 확인은 머지 후 Preview에서
  진행 예정 (변경이 표현식 하나라 위험 낮음)

### 📌 참고사항

- `LineupSheet`를 덮는 유닛/E2E 테스트가 없어 육안 확인이 유일한 검증 경로다.
  변경이 표현식 하나라 위험은 낮지만, 후속으로 시트 테스트를 추가할 여지가 있다
- 관련 이슈: #132 / 근거: `festa-brain` 볼트 DEC-0109
