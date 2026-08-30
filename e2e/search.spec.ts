import { test, expect } from "@playwright/test";

test("통합 검색에서 검색어를 입력하면 결과 화면으로 이동한다", async ({ page }) => {
  await page.goto("/search");

  // 버튼을 누르는 대신 Enter로 제출한다 — nav에도 같은 "검색" 라벨의 버튼이
  // 있어서 getByRole("button", { name: "검색" })이 두 개를 잡아버린다.
  const searchField = page.getByLabel("검색어");
  await searchField.fill("아");
  await searchField.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=/);
  // URL만 보면 부족하다 — 검색 API가 실패해도 같은 URL에서 "검색 결과를
  // 불러오지 못했습니다"를 그린다(search/page.tsx). 결과 헤딩이
  // "{q}" 검색 결과 {n}건 형식이라(같은 파일), 데이터 값을 하드코딩하지 않고도
  // 실제로 결과가 왔는지까지 확인할 수 있다.
  await expect(page.getByText(/검색 결과 \d+건/)).toBeVisible();
});
