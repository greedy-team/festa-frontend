import { test, expect } from "@playwright/test";

for (const [width, height] of [[1440, 800], [1880, 1340], [375, 800]]) {
  test(`축제 0건 이름 배경의 스크롤 전환 (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const hero = page.locator("main > section").first();
    await expect(hero).toBeVisible();
    test.skip(await hero.locator('a[href^="/festivals/"]').count() > 0,
      "예정 축제 0건인 데이터 환경에서 실행하는 시나리오");
    const wall = hero.locator('div[aria-hidden="true"]').filter({ has: page.locator("span") });
    await expect(wall).toBeVisible();
    await expect(wall).toHaveCSS("scale", "1.06");
    await expect(wall).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo(0, innerHeight / 4));
    await expect.poll(() => wall.evaluate((el) => Number(getComputedStyle(el).scale))).toBeCloseTo(1.01, 3);
    await expect.poll(() => wall.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.72917, 3);
    await expect(hero.locator("[inert]")).toHaveCSS("opacity", "0");
    const hiddenHint = hero.locator('button[aria-label="아래로 스크롤"]');
    await hiddenHint.evaluate((el) => el.focus());
    await expect(hiddenHint).not.toBeFocused();
    await expect(hero.getByRole("heading")).toHaveCSS("opacity", "1");
    await expect(hero.getByRole("link", { name: "아티스트 둘러보기 →" })).toHaveCSS("opacity", "1");

    await page.reload(); // 스크롤 복원 상태에서도 배율을 다시 계산한다.
    // 브라우저가 복원한 위치는 스크롤 앵커에 따라 수 px 달라질 수 있다.
    await expect.poll(() => wall.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.72917, 2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(wall).toHaveCSS("scale", "none");
    await expect(wall).toHaveCSS("translate", "none");
    await expect(wall).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo(0, 0));
    const hint = page.getByRole("button", { name: "아래로 스크롤" });
    await expect(hint).toBeVisible();
    await hint.press("Enter");
    const section = page.getByRole("heading", { name: "최근 등록된 축제" });
    await expect(section).toBeInViewport();
    expect((await section.boundingBox())!.y).toBeGreaterThanOrEqual(72);
    await page.screenshot({ path: `/tmp/festa-empty-motion-${width}.png` });
  });
}
