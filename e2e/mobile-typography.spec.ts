import { expect, test } from "@playwright/test";

for (const width of [320, 375, 1440]) {
  test(`${width}px에서 D-day와 목록 제목 크기`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const dday = page.locator("p.order-1").first();
    await expect(dday).toHaveCSS("font-size", width < 640 ? "36px" : "56px");

    for (const path of ["/festivals", "/artists"]) {
      await page.goto(path);
      const title = page.getByRole("heading", { level: 1 });
      await expect(title).toHaveCSS("font-size", width < 640 ? "26px" : "48px");
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
    }
  });
}
