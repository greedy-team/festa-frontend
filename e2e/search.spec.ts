import { test, expect } from "@playwright/test";

test("통합 검색에서 검색어를 입력하면 결과 화면으로 이동한다", async ({ page }) => {
  await page.goto("/search");

  // 버튼을 누르는 대신 Enter로 제출한다 — nav에도 같은 "검색" 라벨의 버튼이
  // 있어서 getByRole("button", { name: "검색" })이 두 개를 잡아버린다.
  const searchField = page.getByLabel("검색어");
  await searchField.fill("아");
  await searchField.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=/);
});
