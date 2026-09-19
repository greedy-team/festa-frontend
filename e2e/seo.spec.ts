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

// 제목·구조화 데이터는 화면에 보이지 않아서, 빠져도 눈으로는 알 수 없다(#259).
// 목 모드에서는 MockProvider가 워커 준비 전까지 본문을 그리지 않아 원본 HTML에 본문이 없다 —
// 그래서 이 둘은 request가 아니라 렌더된 DOM에서 읽는다. 운영 빌드의 원본 HTML에 들어가는 것은
// 구현 보고서에 실측으로 남겼다.
const jsonLd = (page: import("@playwright/test").Page) =>
  page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "null")));

test("축제 상세는 제목에 학교명·연도를 담고 행사 구조화 데이터를 내보낸다", async ({ page }) => {
  await page.goto("/festivals/21");
  await expect(page.locator("h1")).toBeVisible();
  const event = (await jsonLd(page)).find((d) => d["@type"] === "Festival");
  expect(event).toBeTruthy();
  expect(event.url).toBe("https://www.every-festa.com/festivals/21");
  expect(event.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  const title = await page.title();
  expect(title).toContain(event.organizer.name);
  expect(title).toContain(event.startDate.slice(0, 4));
  // 구조화 데이터의 이름과 대표 제목이 같은 말을 해야 한다
  const h1 = ((await page.locator("h1").textContent()) ?? "").replace(/\s+/g, " ").trim();
  expect(h1).toBe(event.name);
});

test("축제 목록은 항목 목록을 내보내고, 고지 모달은 제목 태그를 쓰지 않는다", async ({ page }) => {
  await page.goto("/festivals");
  await expect(page.locator("h1")).toHaveText("전국 대학 축제 모음");
  const list = (await jsonLd(page)).find((d) => d["@type"] === "ItemList");
  expect(list.itemListElement.length).toBeGreaterThan(0);
  expect(list.itemListElement[0].url).toMatch(/^https:\/\/www\.every-festa\.com\/festivals\/\d+$/);
  // 모달 제목이 실제로 그려진 상태에서 본다 — 요소가 없어서 통과하는 것을 막는다
  await expect(page.locator("#site-notice-title")).toHaveCount(1);
  await expect(page.locator(":is(h1,h2,h3,h4,h5,h6)#site-notice-title")).toHaveCount(0);
});
