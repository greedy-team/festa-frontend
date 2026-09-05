import { test, expect } from "@playwright/test";

// host-history.spec.ts가 이력 화면까지 데려다주지만 거기서 연도 칩을 누르지는 않았다(#174).

test("축제 이력에서 연도로 좁히면 주소와 목록이 함께 바뀐다", async ({ page }) => {
  // 이력 화면은 주최 상세를 거쳐야 나온다 — id를 고정하지 않고 홈에서 타고 들어간다.
  await page.goto("/");
  await page.locator('a[href^="/festivals/"]').first().click();
  await page.locator('a[href^="/hosts/"]').first().click();
  await expect(page).toHaveURL(/\/hosts\/\d+$/);

  // 주최 상세가 그려질 때까지 기다린 뒤에 센다 — count()는 자동 대기가 없다.
  await expect(page.locator("h1")).toBeVisible();

  const seeAll = page.getByRole("link", { name: /전체 \d+개/ });
  if ((await seeAll.count()) === 0) {
    throw new Error("축제 이력 전체보기 링크가 없다 — 이력이 0건인 주최에 들어왔다");
  }
  await seeAll.click();
  await expect(page).toHaveURL(/\/hosts\/\d+\/history$/);
  await expect(page.getByRole("heading", { name: "축제 이력" })).toBeVisible();

  const yearChip = page.locator('a[href*="year="]').first();
  if ((await yearChip.count()) === 0) {
    throw new Error("연도 칩이 없다 — availableYears가 비었다");
  }
  const year = (await yearChip.innerText()).trim();

  await yearChip.click();
  await expect(page).toHaveURL(new RegExp(`[?&]year=${year}`));

  // 좁힌 결과는 있거나 없거나 둘 중 하나이고, 에러 화면이면 안 된다.
  const festivalCards = page.locator('a[href^="/festivals/"]');
  const emptyMessage = page.getByText("해당 연도의 축제 이력이 없습니다");
  await expect(festivalCards.first().or(emptyMessage).first()).toBeVisible();

  const cards = await festivalCards.count();
  if (cards === 0) {
    await expect(page.getByText("해당 연도의 축제 이력이 없습니다")).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "축제 이력" })).toBeVisible();
});
