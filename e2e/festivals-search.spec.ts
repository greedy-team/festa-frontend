import { test, expect } from "@playwright/test";

// 검색어를 하드코딩하지 않는다 — 목록의 첫 축제 이름 일부를 그대로 검색어로 써서,
// 실제 데이터가 바뀌어도 "검색하면 그 이름이 결과에 남는다"는 구조만 검증한다.
// (artists-search.spec.ts와 같은 방식)
test("축제를 검색하면 결과가 검색어로 좁혀진다", async ({ page }) => {
  await page.goto("/festivals");

  const firstName = await page.locator("h3").first().innerText();
  const query = firstName.slice(0, Math.min(2, firstName.length));

  const searchInput = page.locator('input[placeholder="축제 이름 검색"]');
  await searchInput.fill(query);
  await searchInput.press("Enter");

  // encodeURIComponent가 인코딩하지 않는 문자(( ) . * !)가 들어간 검색어로
  // 정규식을 만들면 깨진다 — URL을 파싱해 실제 값으로 비교한다.
  expect(new URL(page.url()).searchParams.get("q")).toBe(query);
  await expect(page.locator("h3").first()).toContainText(query);
});

test("검색해도 걸어둔 정렬이 풀리지 않는다", async ({ page }) => {
  await page.goto("/festivals?sort=UPCOMING");

  const firstName = await page.locator("h3").first().innerText();
  const query = firstName.slice(0, Math.min(2, firstName.length));

  const searchInput = page.locator('input[placeholder="축제 이름 검색"]');
  await searchInput.fill(query);
  await searchInput.press("Enter");

  await expect(page).toHaveURL(/sort=UPCOMING/);
  await expect(page).toHaveURL(/[?&]q=/);
});
