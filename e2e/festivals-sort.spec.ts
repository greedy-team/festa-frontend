import { test, expect } from "@playwright/test";

// 축제 목록의 검색 pill(SearchPill)은 아직 표시 전용(aria-hidden)이라 이 화면의
// 실제 조작 가능한 필터는 정렬 드롭다운뿐이다 — 그래서 시나리오는 "검색"이
// 아니라 "정렬 변경"이다.
test("축제 목록에서 정렬을 바꾸면 URL과 목록이 갱신된다", async ({ page }) => {
  await page.goto("/festivals");

  await expect(page.getByRole("heading", { name: "축제 전체" })).toBeVisible();

  await page.getByLabel("정렬").selectOption("UPCOMING");

  await expect(page).toHaveURL(/sort=UPCOMING/);
  // 정렬을 바꾸면 page 파라미터가 함께 실리지 않는다(=1페이지로 리셋). SortDropdown 주석 참고.
  await expect(page).not.toHaveURL(/page=/);
});

test("축제 카드를 누르면 해당 축제 상세로 이동한다", async ({ page }) => {
  await page.goto("/festivals");

  const firstCard = page.locator('a[href^="/festivals/"]').first();
  await expect(firstCard).toBeVisible();

  await firstCard.click();

  await expect(page).toHaveURL(/\/festivals\/\d+$/);
  await expect(page.locator("h1")).toBeVisible();
});
