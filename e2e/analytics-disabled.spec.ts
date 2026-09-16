import { expect, test } from "@playwright/test";

test("분석 비활성 환경은 동의값을 받거나 태그를 노출하지 않는다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "분석 설정", exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "더 편한 축제 탐색을 위한 분석" })).toHaveCount(0);
  await expect(page.locator("#festa-ga4, #festa-clarity")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("festa.analytics-consent.v1"))).toBeNull();
});
