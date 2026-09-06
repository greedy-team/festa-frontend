import { test, expect } from "@playwright/test";

test("축제 상세에서 주최 상세로, 다시 축제 이력 전체보기로 이동한다", async ({ page }) => {
  await page.goto("/");

  const festivalLink = page.locator('a[href^="/festivals/"]').first();
  await expect(festivalLink).toBeVisible();
  await festivalLink.click();
  await expect(page).toHaveURL(/\/festivals\/\d+$/);

  // 호스트 링크 자기 텍스트가 "주최 · {이름} ›" 형식이다(FestivalHero.tsx) —
  // 거기서 이름만 뽑아 상세 페이지 h1과 실제로 일치하는지 본다. h1 존재만 보면
  // error.tsx·not-found.tsx도 h1을 그려서 상세가 깨져도 통과해버린다.
  const hostLink = page.locator('a[href^="/hosts/"]').first();
  await expect(hostLink).toBeVisible();
  const hostLinkText = await hostLink.innerText();
  const hostName = hostLinkText.replace(/^주최\s*·\s*/, "").replace(/\s*›\s*$/, "").trim();

  await hostLink.click();
  await expect(page).toHaveURL(/\/hosts\/\d+$/);
  await expect(page.locator("h1")).toHaveText(hostName);

  await page.getByRole("link", { name: /전체 \d+개/ }).click();
  await expect(page).toHaveURL(/\/hosts\/\d+\/history$/);
  await expect(page.getByRole("heading", { name: "축제 이력" })).toBeVisible();
});
