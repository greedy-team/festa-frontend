import { test, expect } from "@playwright/test";

test("축제 상세에서 주최 상세로, 다시 축제 이력 전체보기로 이동한다", async ({ page }) => {
  await page.goto("/");

  const festivalLink = page.locator('a[href^="/festivals/"]').first();
  await expect(festivalLink).toBeVisible();
  await festivalLink.click();
  await expect(page).toHaveURL(/\/festivals\/\d+$/);

  const hostLink = page.locator('a[href^="/hosts/"]').first();
  await expect(hostLink).toBeVisible();
  await hostLink.click();
  await expect(page).toHaveURL(/\/hosts\/\d+$/);
  await expect(page.locator("h1")).toBeVisible();

  await page.getByRole("link", { name: /전체 \d+개/ }).click();
  await expect(page).toHaveURL(/\/hosts\/\d+\/history$/);
  await expect(page.getByRole("heading", { name: "축제 이력" })).toBeVisible();
});
