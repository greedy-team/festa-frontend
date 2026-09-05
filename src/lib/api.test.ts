import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE, fetchJson } from "./api";

// MOCKING_ENABLED는 모듈 로드 시점에 굳는 상수라 환경변수에 따라 흔들린다
// (NEXT_PUBLIC_API_MOCKING=true로 테스트를 돌리는 사람이 있으면 다른 분기를 잰다).
// 여기서 재려는 것은 실제 fetch 경로라 false로 못박는다.
vi.mock("@/lib/mocking", () => ({ MOCKING_ENABLED: false }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("API_BASE", () => {
  // DEC-0099: 공개·관리자 모든 경로가 /api 아래로 옮겨갔고, api.ts 상단 주석이
  // "여기 한 곳만 고치면 된다"고 못박은 자리다. 아래 호출 URL 단언은 양쪽이 같은
  // API_BASE를 쓰므로 이 상수 자체가 무너지면 함께 바뀌어 못 잡는다 — 따로 못박는다.
  it("/api 접두사로 끝난다", () => {
    expect(API_BASE.endsWith("/api")).toBe(true);
  });
});

describe("fetchJson", () => {
  it("2xx면 본문을 data로 돌려주고, API_BASE에 경로를 붙여 부른다", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ id: 1, name: "아카라카" })));

    const res = await fetchJson<{ id: number; name: string }>("/festivals/1");

    expect(res).toEqual({ ok: true, data: { id: 1, name: "아카라카" } });
    // 호출 URL과 옵션을 단언하지 않으면 fetch(path)로 바꿔도, cache 옵션을 빼도 통과한다.
    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/festivals/1`, { cache: "no-store" });
  });

  it("에러 응답은 status와 문구를 담아 ok:false로 돌려준다 — 던지지 않는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 404, statusText: "Not Found" })),
    );

    const res = await fetchJson("/festivals/999");

    expect(res.ok).toBe(false);
    // 서버 컴포넌트가 이 값으로 notFound()와 에러 화면을 가른다.
    expect(res).toMatchObject({ status: 404 });
  });

  it("서버에 닿지도 못하면 status가 null이다 — 404와 구분되는 지점", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    const res = await fetchJson("/festivals");

    // status: null = 응답 자체가 없었다(연결 실패·DNS·타임아웃). 이 구분이
    // 무너지면 "API가 죽었다"와 "결과가 0건이다"가 화면에서 같아진다.
    expect(res).toMatchObject({ ok: false, status: null });
  });

  it("응답은 왔는데 본문이 JSON이 아니면 status가 남는다 — null이 아니다", async () => {
    // 200인데 에러 페이지 HTML이 오는 경우(프록시·게이트웨이가 가로챈 응답).
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>oops</html>", { status: 200 })),
    );

    const res = await fetchJson("/festivals");

    expect(res.ok).toBe(false);
    // 여기가 위 테스트와 갈리는 자리다. status를 응답 직후에 채우지 않으면
    // 파싱 실패가 "서버에 닿지 못함"으로 둔갑한다.
    expect(res).toMatchObject({ status: 200 });
  });
});
