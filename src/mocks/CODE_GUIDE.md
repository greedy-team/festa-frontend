# 코드 설명

`README.md`가 "어떻게 설치/실행하는지"라면, 이 문서는 **"코드가 왜 이렇게 짜여있고 어떻게 동작하는지"**를 설명한다. 특히 팀원이 처음 이 폴더를 열어봤을 때 참고할 용도.

---

## 1. MSW가 하는 일 — 한 줄 요약

**실제 네트워크 요청을 가로채서 가짜 응답을 돌려준다.** 컴포넌트 코드 입장에선 `fetch('/api/festivals/21')`을 평소처럼 부르는 거고, 그 요청이 진짜 백엔드로 안 가고 우리가 만든 handler가 가로채서 응답한다. 나중에 실제 API 주소로 바꿔도 컴포넌트 코드는 한 글자도 안 바꿔도 된다 — 이게 MSW를 쓰는 이유다.

---

## 2. 파일 구조와 각자의 역할

```
src/mocks/
  fixtures/
    db.ts          # 원본 데이터 (가짜 DB)
    pagination.ts  # 공통 페이지네이션 계산
    errors.ts       # 공통 에러 응답 생성
    date.ts          # today/dday/festivalStatus 단일 기준
    appearances.ts    # findAppearances — artists.ts·search.ts 공유
  handlers/
    festivals.ts    # /festivals 관련 5개 요청을 가로채는 곳
    artists.ts       # /artists 관련 2개
    hosts.ts          # /hosts 관련 1개
    search.ts         # /search 관련 2개
    index.ts           # 위 4개를 하나로 합침
  browser.ts          # 브라우저(Client Component)에서 가로채기 시작
  server.ts            # 서버(Node, Server Component)에서 가로채기 시작
  MockProvider.tsx     # 브라우저 워커를 앱에 연결하는 컴포넌트
instrumentation.ts      # Next.js가 서버 켤 때 자동으로 server.ts를 실행시킴
```

### 2.1 `fixtures/db.ts` — 모든 데이터의 원본

축제/아티스트/주최 정보를 배열로 들고 있는 파일. **모든 handler가 이 배열 하나만 참조한다.** 여기가 왜 중요하냐면:

```ts
export const artistsDb = [
  { id: 7, name: '아이유', ... },
];
export const festivalsDb = [
  {
    id: 21,
    name: '아카라카 2026',
    hostId: 3,                              // ← host를 이름이 아니라 id로 참조
    lineup: [{ day: 1, artists: [{ artistId: 7, ... }] }],  // ← 아티스트도 id로 참조
  },
];
```

`festivalsDb`가 아티스트/주최를 **이름 문자열이 아니라 ID로만 참조**한다. 실제 관계형 DB의 외래키(foreign key)랑 같은 개념이다. 장점:

- "아이유"라는 문자열을 여러 파일에 중복해서 안 적어도 됨 → 이름 하나 바꾸면 `artistsDb` 한 줄만 고치면 전체에 반영
- **F-13 순환탐색(축제→아티스트→축제) E2E가 실제로 의미 있게 동작함** — 라인업의 `artistId`가 실존하는 아티스트를 가리키는 게 구조적으로 보장되기 때문에, "존재하지 않는 아티스트로 링크가 깨지는" 상황 자체가 안 생긴다.

### 2.2 `handlers/*.ts` — 요청을 가로채서 응답을 조립하는 곳

`http.get(URL패턴, 콜백)` 형태로 등록한다.

```ts
http.get(`${API}/festivals/:id`, ({ params, request }) => {
  const f = festivalsDb.find((x) => x.id === Number(params.id));
  if (!f) return Errors.festivalNotFound(new URL(request.url).pathname);
  // f를 API 명세서에 정의된 응답 모양으로 다시 조립
  return HttpResponse.json({ id: f.id, name: f.name, ... });
});
```

`/festivals/21`처럼 요청이 오면 `params.id`에 `"21"`이 들어오고, `db.ts`에서 찾아서 **명세서 스펙 그대로 JSON을 조립**해 리턴한다.

라인업의 `artistId: 7`을 실제 이름/이미지로 보여주려면 조인이 필요한데, 그 부분이 이거다:

```ts
const artist = artistsDb.find((ar) => ar.id === a.artistId)!;
return { id: artist.id, name: artist.name, imageUrl: artist.imageUrl, ... };
```

SQL의 JOIN과 개념이 동일하다 — 그냥 JS 코드로 직접 짠 것뿐.

### 2.3 `fixtures/errors.ts` — 에러 응답 만드는 공통 헬퍼

```ts
export function apiError(code, message, status, instance) {
  return HttpResponse.json({ errorCode: code, message, status, instance }, { status });
}

export const Errors = {
  festivalNotFound: (instance) => apiError('FESTIVAL_NOT_FOUND', '존재하지 않는 축제입니다.', 404, instance),
  // ...
};
```

각 handler는 검증 실패 시 `Errors.xxx(instance)`를 리턴하기만 하면 된다. 에러 응답 형식(필드명 `errorCode` 등)이 나중에 바뀌면 **이 파일 하나만 고치면 10개 엔드포인트 전체에 반영**된다 — 이게 공통 헬퍼로 뺀 이유.

### 2.4 `server.ts` / `browser.ts` — handler들을 실제로 "가로채기 등록"

```ts
export const server = setupServer(...handlers); // Node 환경 (Server Component fetch)
export const worker = setupWorker(...handlers); // 브라우저 환경 (Client Component fetch)
```

같은 `handlers` 배열을 쓰지만 둘로 나뉜 이유: MSW가 Node랑 브라우저에서 요청을 가로채는 내부 구현 방식이 다르기 때문이다.

- **Node(`server.ts`)**: fetch 함수 자체를 patch하는 방식
- **브라우저(`browser.ts`)**: 진짜 Service Worker(브라우저 API)를 등록해서 네트워크 레이어에서 가로채는 방식

### 2.5 `instrumentation.ts` — 파일은 남아 있지만 서버 사이드 모킹의 실제 경로가 아니다

이 파일은 `msw/node`의 `setupServer()`로 네트워크 레벨에서 fetch를 가로채는 방식이었는데,
**이 인터셉션이 Vercel 서버리스 함수에서는 안 걸리는 문제가 있었다(#75).** 그래서 서버
사이드는 인터셉션 자체를 우회하는 방식으로 바뀌었다 — `lib/api.ts`의 `fetchJson`이
`MOCKING_ENABLED`일 때 네트워크를 아예 안 타고, `mocks/handlers`의
`RequestHandler.run()`을 직접 호출해서 응답을 만든다(`fetchMockJson`, `api.ts` 참고).

```ts
async function fetchMockJson<T>(path: string): Promise<ApiResult<T>> {
  const { handlers } = await import('@/mocks/handlers');
  const request = new Request(`${API_BASE}${path}`);
  for (const handler of handlers) {
    const result = await handler.run({ request, requestId: crypto.randomUUID() });
    if (result?.response) return /* ApiResult로 변환 */;
  }
  // ...
}
```

`instrumentation.ts`의 `server.listen()`은 로컬 `next start`에서는 여전히 동작하지만,
**실제로 쓰이는 경로는 이제 이쪽이 아니다** — 배포 환경(Vercel)에서 서버 사이드 모킹을
살리는 건 전적으로 `fetchMockJson`이다. 클라이언트 사이드(`MockProvider.tsx`)는 여전히
원래 방식(Service Worker 인터셉션)을 쓴다 — 브라우저에는 서버리스 문제가 없기 때문이다.

### 2.6 `MockProvider.tsx` — 브라우저 쪽은 자동이 아니라서 직접 켜야 함

브라우저는 `instrumentation.ts` 같은 자동 훅이 없다. 그래서 앱이 처음 렌더될 때 `worker.start()`를 직접 호출해줘야 하고, `app/layout.tsx`에서 이 컴포넌트로 앱을 감싸는 방식으로 처리한다.

```tsx
useEffect(() => {
  async function init() {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    setReady(true);
  }
  init().catch((e) => {
    console.error('[MSW] worker.start() 실패 — 모킹 없이 계속 진행합니다', e);
    setReady(true); // worker.start()가 실패해도 화면은 그려야 하므로 ready 처리
  });
}, []);

if (!ready) return null; // 워커 켜지기 전까진 아무것도 안 그림
```

`ready`가 `true`가 되기 전엔 `null`을 리턴하는 이유: 안 그러면 워커가 켜지기 전에 자식 컴포넌트가 먼저 `fetch`를 날려서 **진짜 네트워크로 요청이 새버릴 수 있다.**

---

## 3. 실제 흐름 예시 — 축제 상세 페이지(id=21) 진입 시

1. Next.js 서버가 `app/festivals/[id]/page.tsx`(Server Component)를 렌더하면서 `getFestival(21)` → `lib/api.ts`의 `fetchJson('/festivals/21')` 호출
2. `fetchJson`이 `MOCKING_ENABLED`를 보고 실제 fetch 대신 `fetchMockJson`으로 분기 — `handlers/festivals.ts`의 `GET /festivals/:id` handler의 `run()`을 직접 호출한다(네트워크 자체를 안 탄다. 2.5절 참고)
3. handler가 `festivalsDb`에서 id=21을 찾고, `hostsDb`/`artistsDb`에서 관련 데이터를 조인해서 명세서 스펙대로 JSON 조립
4. 그 JSON을 페이지 컴포넌트가 평소처럼 받아서 렌더링

**컴포넌트 코드 입장에선 진짜 백엔드랑 대화하는지 MSW랑 대화하는지 구분할 방법이 전혀 없다** — 그게 이 구조의 핵심이다.

---

## 4. 도메인별 특이사항

### festivals.ts
- `festivalStatus()`, `dday` 계산은 `fixtures/date.ts`를 쓴다(문자열 비교라 UTC/로컬 불일치는 없음). 날짜를 고정해야 하는 테스트(D-day 스냅샷 등)를 만들 때는 `todayStr()`을 인자 주입식으로 바꿔야 한다.
- `/festivals/recent`의 "최근 등록순"은 fixture에 `createdAt`이 없어서 배열 순서(뒤쪽이 최근)로 대체했다.
- `/festivals/{id}/notices`(3.6)는 없다 — 2026-08-09 회의 결정으로 범위 제외됐다(DOC-0007).

### artists.ts
- `upcomingShows`/`appearances`는 DB에 별도로 저장돼 있지 않고, `festivalsDb`의 라인업을 순회하면서 **그때그때 계산**해서 만든다 (`fixtures/appearances.ts`의 `findAppearances` 함수 — `search.ts`도 같은 함수로 `appearanceCount`를 계산해서 두 엔드포인트 값이 항상 일치한다). `performanceDate = festival.startDate + (lineup.day - 1)` 계산도 명세서 1.5 규칙 그대로 구현.
- `upcomingShows`/`appearances` 분리 기준이 DOC-0007 문서와 다르다 — 문서는 `past`를 `festival.endDate` 기준으로 판정하는데, 그러면 진행 중인 다일 축제에서 이미 지나간 공연이 양쪽 다 안 잡히는 구멍이 생긴다. 여기선 둘 다 `performanceDate` 기준으로 배타적으로 나눴다. 백엔드 개발자 검토 후 실제 동작이 다르면 바뀔 수 있음 — 근거는 `artists.ts`의 해당 필터 주석 참고.

### hosts.ts
- `frequentArtists`(자주 온 아티스트)도 저장된 값이 아니라, 해당 host의 축제 라인업을 순회하면서 등장 횟수를 집계(`Map`)해서 만든다.
- `type` 필드 결론·제거 범위는 `MOCKING_STRATEGY.md`의 "5. 갱신"이 정본이다(#125/PR #126) — 여기서 반복하지 않는다.

### search.ts
- 매칭 로직은 단순 `includes()` 뿐이다. 실제 검색엔진의 랭킹/형태소 분석을 흉내내지 않는다 — UI가 `type` 분기(`ALL`/`ARTIST`/`HOST`/`FESTIVAL`)와 `primary`가 `null`인 경우를 잘 처리하는지 확인하는 용도로만 쓸 것.

### errors.ts
- 코드 자체에 아직 팀 컨펌 안 된 지점을 주석으로 표시해뒀다 (`FESTIVAL_INVALID_LIMIT` 범위 등). `grep -rn "팀 확인\|컨펌"` 해보면 전부 찾을 수 있다.

---

## 5. 새 엔드포인트를 추가하고 싶을 때 (예: lost-items 착수 시)

1. `fixtures/db.ts`에 관련 데이터 타입/배열 추가 (기존 host/artist와 관계가 있으면 ID로 참조)
2. `handlers/lostItems.ts` 새로 만들고, 기존 `festivals.ts` 패턴 그대로 따라가기 (`http.get` 등록 → db 조회 → 없으면 `Errors.xxx` → 있으면 스펙대로 JSON 조립)
3. `handlers/index.ts`에 `lostItemsHandlers` import해서 배열에 추가
4. 에러 코드가 필요하면 `fixtures/errors.ts`의 `Errors` 객체에 추가
