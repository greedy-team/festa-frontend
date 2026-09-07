import { afterEach, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

vi.mock("@/lib/mocking", () => ({ MOCKING_ENABLED: false }));
afterEach(() => vi.unstubAllGlobals());

it("공개 API의 마지막 페이지까지 읽고 학교 중복을 제거한다", async () => {
  const fetcher = vi.fn(async (input: string) => {
    const url = new URL(input);
    const page = Number(url.searchParams.get("page"));
    const items = url.pathname.endsWith("/festivals")
      ? [{ festivalId: page + 1, host: { id: 7 } }]
      : [{ artistId: page + 10 }];
    return Response.json({ items, hasNext: page === 0 });
  });
  vi.stubGlobal("fetch", fetcher);
  const urls = (await sitemap()).map((entry) => entry.url);
  expect(fetcher).toHaveBeenCalledTimes(4);
  expect(urls).toEqual([
    "https://www.every-festa.com/", "https://www.every-festa.com/festivals", "https://www.every-festa.com/artists",
    "https://www.every-festa.com/festivals/1", "https://www.every-festa.com/hosts/7", "https://www.every-festa.com/hosts/7/history",
    "https://www.every-festa.com/festivals/2", "https://www.every-festa.com/artists/10", "https://www.every-festa.com/artists/11",
  ]);
});

it("빈 공개 목록은 고정 페이지 세 개만 반환한다", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ items: [], hasNext: false })));
  expect(await sitemap()).toHaveLength(3);
});

it("중간 API 실패를 부분 사이트맵 성공으로 숨기지 않는다", async () => {
  vi.stubGlobal("fetch", vi.fn()
    .mockResolvedValueOnce(Response.json({ items: [{ festivalId: 1, host: { id: 7 } }], hasNext: true }))
    .mockResolvedValueOnce(new Response(null, { status: 503 })));
  await expect(sitemap()).rejects.toThrow("Sitemap festivals: 503");
});
