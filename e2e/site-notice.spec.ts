import { expect, test } from "@playwright/test";

// 이 스펙만 "고지를 아직 못 본 방문자"로 시작한다. 나머지 스펙은
// playwright.config.ts의 storageState가 이미 확인한 상태로 띄운다.
test.use({ storageState: { cookies: [], origins: [] } });

const notice = "로그인 없이 바로 볼 수 있어요";

test("첫 방문에 약관 적용을 알리고, 확인하면 다시 뜨지 않는다", async ({ page }) => {
  await page.goto("/");

  const dialog = page.getByRole("dialog", { name: notice });
  await expect(dialog).toBeVisible();
  const terms = dialog.getByRole("link", { name: "이용약관", exact: true });
  await expect(terms).toHaveAttribute("href", "/terms");
  await expect(dialog.getByRole("link", { name: "개인정보 처리방침", exact: true })).toHaveAttribute("href", "/privacy");

  // 열자마자 첫 행에만 포커스 링이 둘리면 두 행이 다르게 보인다. 포커스는
  // 컨테이너에 두되 Tab은 정상적으로 행에 닿아야 한다 — 링을 지우는 것이 아니라
  // 옮기는 것이므로 둘 다 확인한다.
  await expect(dialog).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(terms).toBeFocused();

  await dialog.getByRole("button", { name: "확인했어요" }).click();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("festa.site-notice.v1"))).toBe("acknowledged");

  await page.reload();
  await expect(page.getByRole("dialog", { name: notice })).toBeHidden();
});

test("Escape로 닫아도 고지를 본 것으로 기록한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: notice })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: notice })).toBeHidden();

  await page.reload();
  await expect(page.getByRole("dialog", { name: notice })).toBeHidden();
});

test("약관을 읽는 동안에는 덮지 않고, 돌아오면 다시 띄운다", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: notice });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("link", { name: "이용약관", exact: true }).click();
  await expect(page).toHaveURL(/\/terms$/);
  // 읽으러 온 문서를 고지가 다시 덮으면 안 된다.
  await expect(page.getByRole("dialog", { name: notice })).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("festa.site-notice.v1"))).toBeNull();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog", { name: notice })).toBeVisible();
});

test("관리자 화면에서는 고지를 띄우지 않는다", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("dialog", { name: notice })).toHaveCount(0);
});

test("고지를 확인하기 전에는 분석 동의 모달이 겹치지 않는다", async ({ page }) => {
  test.skip(!process.env.ANALYTICS_E2E, "분석 활성 운영 조건 서버에서만 실행");

  await page.goto("/");
  await expect(page.getByRole("dialog", { name: notice })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "더 편한 축제 탐색을 위한 분석" })).toBeHidden();

  await page.getByRole("button", { name: "확인했어요" }).click();
  await expect(page.getByRole("dialog", { name: "더 편한 축제 탐색을 위한 분석" })).toBeVisible();
});
