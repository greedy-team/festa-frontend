# FESTA 프론트 모킹 (MSW)

## 구조

```
src/mocks/
  fixtures/
    db.ts          # 단일 진실 소스 — host/artist/festival 원본 데이터. 여기만 고치면 전체 응답이 같이 갱신됨
    pagination.ts  # 공통 페이지네이션 헬퍼
    errors.ts       # 공통 에러 응답 생성
    date.ts          # today/dday/festivalStatus 단일 기준
    appearances.ts    # findAppearances — artists.ts·search.ts 공유
  handlers/
    festivals.ts   # 3.1~3.5 (5개) — {id}/notices는 2026-08-09 회의 결정으로 범위 제외(DOC-0007)
    artists.ts     # 4.1~4.2 (2개)
    hosts.ts       # 5.1 (1개)
    search.ts      # 7.1~7.2 (2개)
    index.ts        # 위 4개를 합침
  browser.ts        # Client Component fetch용 워커
  server.ts         # Server Component / Node 런타임용
  MockProvider.tsx   # 브라우저 워커를 앱에 연결하는 Client Component
instrumentation.ts   # Next.js가 서버 시작 시 자동 호출 — async Server Component의 fetch를 여기서 가로챔
```

lost-items는 P1로 보류돼서 핸들러 없음. 나중에 착수하면 `handlers/lostItems.ts`를 만들고
`handlers/index.ts`에 추가하면 됨.

## 설치

```bash
pnpm add -D msw
pnpm exec msw init public/ --save
```

로컬 `.env.local`에 `NEXT_PUBLIC_API_MOCKING`과 `NEXT_PUBLIC_API_BASE_URL`을 넣어두면
나중에 실제 백엔드로 스위치할 때 이 두 값만 바꾸면 된다 (`NEXT_PUBLIC_API_MOCKING=disabled`,
`NEXT_PUBLIC_API_BASE_URL=<실제 API 주소>`). `NEXT_PUBLIC_` 접두사가 붙은 값은 Next.js가
자동으로 인라인하므로 `next.config.ts`를 따로 건드릴 필요는 없다. 이 저장소는 앱 환경변수를
Vercel에 등록해 `vercel env pull .env.local`로 당겨오는 방식을 쓰는데, 모킹 플래그는 로컬
개발 전용이라 Vercel에는 등록하지 않는다 — Preview/Production 빌드는 모킹 없이 그대로 동작한다.

## 켜는 법

1. **서버 사이드 (async Server Component)**: `instrumentation.ts`가 자동으로 처리한다.
   `NEXT_PUBLIC_API_MOCKING=enabled`일 때만 켜지므로, 배포 빌드에서 실수로 모킹이 남아있을
   걱정은 없다.
2. **클라이언트 사이드 (검색 자동완성처럼 브라우저에서 직접 fetch하는 컴포넌트)**:
   `app/layout.tsx`에서 `<MockProvider>`로 감싼다.

## 에러 응답

`fixtures/errors.ts`에 공통 헬퍼(`apiError`, `Errors.*`)를 만들어서 10개 엔드포인트에
전부 연결했다. **에러 코드 이름/철자는 에러 코드 마스터 문서(v1)를 기준으로 한다** —
그 외 필드 구조·파라미터 범위 등은 개별 페이지 export(api_export.zip)를 기준으로 한다.
두 기준 문서가 서로 다른 역할을 담당하는 구조.

- `errorCode`: 응답 필드명 확정 완료
- `SEARCH_INVALID_QUERY`(정상 철자), `ARTIST_INVALID_GENRE_TYPE`(S 없음) — 마스터 카탈로그
  기준으로 확정
- **`FESTIVAL_INVALID_LIMIT`의 유효 범위**는 여전히 미확정. 개별 페이지의 Query Parameter
  표(`/upcoming` 1~50, `/recent` 1~30)를 기준으로 구현해뒀지만, 같은 문서의 Status 표와
  마스터 카탈로그 둘 다 "1~10"이라고 되어 있어 팀 확인 필요.

## 설계 메모 (다음에 이어 작업할 때 참고)

- **`db.ts`가 유일한 데이터 소스**다. festivals/artists/hosts 핸들러가 각자 하드코딩하지 않고
  전부 여기서 파생시킨다. F-13 순환탐색(축제→아티스트→축제) E2E가 실제로 의미 있으려면
  라인업의 artistId가 진짜 존재하는 아티스트를 가리켜야 하는데, 이 구조가 그걸 보장한다.
- **`hosts.type` 필드는 일단 포함**했다 (부록 변경사항엔 "제거 예정"이라 써 있지만 실제
  필드표/응답 예시엔 남아있어서 스펙 원문 기준으로 넣음 — `hosts.ts` 주석 참고). 제거로
  확정되면 `hosts.ts`의 `type: host.type,` 한 줄만 지우면 됨.
- **`/auth/me`는 만들지 않았다** — 이번 버전은 로그인 기능 자체가 없는 것으로 확정.
- **날짜 계산(`festivalStatus`, `dday`)은 `fixtures/date.ts`의 `todayStr()`/`daysUntil()`/
  `festivalStatus()`로 통일했다.** 문자열(YYYY-MM-DD) 비교라 UTC/로컬 파싱 불일치 버그는
  없지만, 여전히 실제 `new Date()` 기준이라 시간이 지나면 fixture의 상태(ONGOING/UPCOMING/
  ENDED)가 다시 바뀐다. 테스트에서 "오늘"을 고정해야 하는 경우(D-day 스냅샷 등) `todayStr()`을
  주입 가능한 형태로 바꿀 것 — Playwright에서 시스템 시간을 mock하지 않으면 매일 결과가 바뀐다.
- **`findAppearances`/`performanceDate`는 `fixtures/appearances.ts`에 있다.** `artists.ts`와
  `search.ts`가 같이 쓴다 — `search.ts`의 `appearanceCount`가 하드코딩 0이던 문제를 이 공유로
  해소했다.
- **`/festivals/recent`의 "최근 등록순"은 fixture에 `createdAt`이 없어서** 배열 순서(뒤에
  있는 게 최근)로 대체했다. 실제 등록순 검증이 필요해지면 `db.ts`에 `createdAt` 필드를 추가.
- **검색(`search.ts`)의 매칭/랭킹 로직은 매우 단순한 `includes()` 기반**이다. 실제 검색엔진
  동작(형태소 분석, 유사도 등)을 흉내내지 않는다 — UI가 `type` 분기와 `primary` null 처리를
  잘 하는지 확인하는 용도로만 쓸 것.
- **HMR이 서버측 모킹을 푼다.** `instrumentation.ts`의 `register()`는 서버 부팅 시 한 번만
  실행된다. 파일을 고쳐 HMR이 돌면 그 패치가 풀려 서버 컴포넌트의 `fetch`가 실제 인터넷으로
  나간다. `api.festa.kr`은 실재하는 도메인이라 DNS는 뚫리고 TLS에서 막히는데, 앱의
  `fetchJson`이 그 실패를 삼키므로 **화면은 500이 아니라 조용히 빈 상태로 뜬다.** 로컬에서
  데이터가 안 보이면 핸들러나 목 데이터를 의심하기 전에 `.next`를 지우고 dev 서버를
  재시작해라.
