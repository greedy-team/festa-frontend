import { test, expect } from "@playwright/test";

// 가드(admin-guard)는 덮여 있었지만 루트 리다이렉트와 로그아웃은 비어 있었다(#174).

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.evaluate(() => {
    window.localStorage.setItem("festa.admin.accessToken", "mock-access-token");
  });
}

test("관리자 루트로 접근하면 검수 화면으로 이동한다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/festivals$/);
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();
});

test("로그아웃하면 토큰이 지워지고 로그인 화면으로 돌아간다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/festivals");
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();

  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);

  // 화면만 옮기고 토큰이 남아 있으면 뒤로가기로 다시 들어가진다.
  const token = await page.evaluate(() =>
    window.localStorage.getItem("festa.admin.accessToken"),
  );
  expect(token).toBeNull();
});
