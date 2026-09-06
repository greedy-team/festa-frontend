import { test, expect } from "@playwright/test";

test("로그인 토큰 없이 콘솔에 접근하면 로그인 화면으로 리다이렉트된다", async ({ page }) => {
  // 새 브라우저 컨텍스트라 localStorage가 비어 있다 — 토큰이 없는 상태.
  await page.goto("/admin/festivals");

  await expect(page).toHaveURL(/\/admin\/login$/);
});
