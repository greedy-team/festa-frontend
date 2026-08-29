import { test, expect } from "@playwright/test";

// 실제 데이터를 쓰는 E2E다 — 특정 축제 이름이 아니라 "카드를 누르면 그 축제의
// 상세로 간다"는 구조만 검증한다. 데이터가 바뀌어도 테스트는 흔들리지 않는다.
test("홈에서 축제 카드를 누르면 해당 축제 상세로 이동한다", async ({ page }) => {
  await page.goto("/");

  // 히어로 패널·최근 등록된 축제 카드 둘 다 /festivals/{id}로 링크된다.
  // 어느 쪽이든 첫 번째 링크로 이동이 실제로 되는지만 확인한다. 이름은 히어로가
  // h2, 최근 카드가 h3라 둘 다 잡히게 둘 다 찾는다.
  const firstFestivalLink = page.locator('a[href^="/festivals/"]').first();
  await expect(firstFestivalLink).toBeVisible();
  const festivalName = await firstFestivalLink.locator("h2, h3").first().innerText();

  await firstFestivalLink.click();

  await expect(page).toHaveURL(/\/festivals\/\d+$/);
  // h1만 보이는지 확인하면 부족하다 — error.tsx·not-found.tsx도 h1을 그려서
  // 상세가 500·404여도 통과해버린다. 클릭한 카드의 이름과 실제로 일치하는지까지 본다.
  await expect(page.locator("h1")).toHaveText(festivalName);
});
