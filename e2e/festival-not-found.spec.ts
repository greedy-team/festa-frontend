import { test, expect } from "@playwright/test";

// 404 화면과 "불러오지 못했습니다" 안내는 다른 것을 뜻한다 — 전자는 없는 축제,
// 후자는 조회 실패다. 둘 다 검증이 없어서 하나가 다른 하나로 둔갑해도 몰랐다(#174).

test("없는 축제 id로 접근하면 404 화면이 뜬다", async ({ page }) => {
  await page.goto("/festivals/99999999");

  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
  // 조회 실패 안내와 섞이지 않는지 함께 본다.
  await expect(page.getByText("축제 정보를 불러오지 못했습니다")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /홈으로/ })).toBeVisible();
});

test("숫자가 아닌 id로 접근해도 404 화면이 뜬다", async ({ page }) => {
  // page.tsx가 API를 부르기 전에 Number.isInteger로 먼저 걸러내는 경로다.
  await page.goto("/festivals/abc");

  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
});

test("404 화면의 홈으로 링크가 실제로 홈에 데려다준다", async ({ page }) => {
  await page.goto("/festivals/99999999");
  await page.getByRole("link", { name: /홈으로/ }).click();

  await expect(page).toHaveURL(/\/$/);
});
