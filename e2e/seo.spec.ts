import { expect, test } from "@playwright/test";

// JS를 실행하지 않는 공유 봇의 원본 HTML을 검사한다.
test.use({ userAgent: "Twitterbot/1.0" });

test("축제가 있는 홈도 문서 제목을 하나 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
});

for (const path of ["/", "/festivals", "/artists", "/festivals/21", "/artists/3", "/hosts/3", "/hosts/3/history"]) {
  test(`${path}: 공개 페이지의 대표 URL·공유 메타데이터`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head).toContain(`rel="canonical" href="https://www.every-festa.com${path === "/" ? "" : path}"`);
    expect(head).toContain('property="og:title"');
    expect(head).toContain('property="og:description"');
    expect(head).toContain('content="https://www.every-festa.com/festa-og-image.jpg"');
    expect(head).toContain('name="twitter:card" content="summary_large_image"');
    expect(head).toContain('href="/festa_symbol.png?v=e225f8f0"');
    expect(head).not.toContain('href="/favicon.ico');
    expect(head).not.toContain("noindex");
    const title = head.match(/<title>(.*?)<\/title>/)?.[1];
    const ogTitle = head.match(/property="og:title" content="(.*?)"/)?.[1];
    expect(title).toBeTruthy();
    expect(ogTitle).toBe(title);
  });
}

test("검색·관리자·showcase는 검색에서 제외한다", async ({ request }) => {
  for (const path of ["/search?q=축제", "/festivals?q=축제", "/artists?genre=BAND", "/admin/login"]) {
    const response = await request.get(path);
    expect(await response.text()).toMatch(/name="robots" content="[^"]*noindex/);
  }
  for (const path of ["/showcase", "/showcase/hero"]) {
    const response = await request.get(path);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  }
});

test("기본 정렬의 2페이지는 홈이나 1페이지로 합치지 않는다", async ({ request }) => {
  const response = await request.get("/festivals?page=2&sort=LATEST");
  const html = await response.text();
  expect(html).toContain('rel="canonical" href="https://www.every-festa.com/festivals?page=2"');
  expect(html).not.toMatch(/name="robots" content="[^"]*noindex/);
});

test("없는 상세·이력은 스트리밍 상태와 무관하게 색인하지 않는다", async ({ request }) => {
  for (const path of ["/festivals/99999999", "/artists/abc", "/hosts/99999999", "/hosts/abc/history"]) {
    const response = await request.get(path);
    // Next.js는 이미 스트리밍을 시작한 notFound 응답에는 200을 사용한다.
    expect([200, 404]).toContain(response.status());
    expect(await response.text()).toMatch(/name="robots" content="[^"]*noindex/);
  }
});

test("robots는 사이트맵을 안내하고 사이트맵에는 공개 상세 URL만 들어간다", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap: https://www.every-festa.com/sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("https://www.every-festa.com/festivals/21</loc>");
  expect(xml).toContain("https://www.every-festa.com/artists/3</loc>");
  expect(xml).toContain("https://www.every-festa.com/hosts/3/history</loc>");
  expect(xml).not.toMatch(/\/(admin|showcase|search)[/< ?]/);
});
