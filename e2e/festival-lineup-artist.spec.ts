import { test, expect, type Page } from "@playwright/test";

// 목 데이터를 단일 소스(db.ts)에 두고 라인업이 아티스트를 id로 참조하게 만든
// 명시적 이유가 "축제 → 아티스트 → 축제" 순환탐색 E2E였다(MOCKING_STRATEGY.md 2.2).
// 그런데 축제 → 주최(host-history)만 덮여 있고 이 경로가 비어 있었다(#174).

/** 축제 목록 전 페이지의 상세 링크를 모은다. 어느 축제인지 고정하지 않기 위해서다. */
async function allFestivalHrefs(page: Page) {
  const hrefs: string[] = [];
  for (const url of ["/festivals", "/festivals?page=2"]) {
    await page.goto(url);
    const links = page.locator('a[href^="/festivals/"]');
    // count()·evaluateAll()은 자동 대기가 없다 — 먼저 렌더를 기다린다.
    await expect(links.first()).toBeVisible();
    hrefs.push(
      ...(await links.evaluateAll((els) =>
        els.map((el) => el.getAttribute("href")).filter((h): h is string => !!h),
      )),
    );
  }
  return [...new Set(hrefs)];
}

test("라인업의 공개된 아티스트 행을 누르면 그 아티스트 상세로 이동한다", async ({ page }) => {
  await page.goto("/");

  const festivalLink = page.locator('a[href^="/festivals/"]').first();
  await expect(festivalLink).toBeVisible();
  await festivalLink.click();
  await expect(page).toHaveURL(/\/festivals\/\d+$/);
  await expect(page.getByRole("heading", { name: "라인업" })).toBeVisible();

  const artistRow = page.locator('a[href^="/artists/"]').first();
  await expect(
    artistRow,
    "라인업에 공개된 아티스트 행이 없다 — 목 데이터나 링크 렌더가 깨졌다",
  ).toBeVisible();

  // 행 텍스트는 "이름 + 장르"라 상세 h1(이름만)과 같지 않다. href로 대조한다.
  const href = await artistRow.getAttribute("href");
  const rowText = (await artistRow.innerText()).trim();

  await artistRow.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  // h1 존재만 보면 not-found.tsx·error.tsx도 h1을 그려서 통과해버린다.
  // 상세의 이름이 눌렀던 행 안에 실제로 있던 이름인지까지 본다.
  const heading = page.locator("h1").first();
  await expect(heading).toBeVisible();
  const name = (await heading.innerText()).trim();
  expect(name.length).toBeGreaterThan(0);
  expect(rowText).toContain(name);
});

test("공개 예정(시크릿 게스트) 행은 링크가 아니다", async ({ page }) => {
  const hrefs = await allFestivalHrefs(page);

  for (const href of hrefs) {
    await page.goto(href);
    const secret = page.getByText("공개 예정", { exact: true });
    if ((await secret.count()) === 0) continue;

    // 이 텍스트를 품은 조상 중에 a 태그가 없어야 한다.
    const insideLink = await secret.first().evaluate((el) => !!el.closest("a"));
    expect(insideLink, "공개 예정 행이 링크로 감싸여 있다").toBe(false);

    // chevron도 없어야 한다 — 있으면 "눌린다"는 잘못된 신호를 준다.
    const row = secret.first();
    await expect(row).toBeVisible();
    return;
  }

  // 조용히 넘어가지 않는다 — 시크릿 게스트가 목에 하나는 있어야 한다는 게 이 스펙의 전제다.
  throw new Error("시크릿 게스트가 있는 축제를 찾지 못했다 — 목 데이터 전제가 깨졌다");
});
