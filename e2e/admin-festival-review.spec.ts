import { test, expect } from "@playwright/test";

// features/admin/festival/api.ts는 아직 실제 백엔드가 아니라 모듈 스코프의 로컬
// 픽스처(adminFestivalsFixture)를 직접 조작한다 — MSW도 아니고 네트워크도 안 탄다.
// "백엔드 연결일에 이 본문이 adminFetch 호출로 바뀐다"는 주석이 파일에 있다 — 백엔드가
// 붙으면 이 목이 사라지므로, 그때 이 테스트가 실제 API를 타는지 다시 확인해야 한다.
//
// 픽스처는 페이지가 새로 로드될 때마다(모듈 재평가) 초기 상태로 돌아간다 — 테스트마다
// page.goto로 새로 열기만 하면 격리된다.
//
// festivalId 1 "아카라카 2025"는 lineupCount 6 · hostId 3 · published:false로 고정돼
// 있어 발행 조건을 항상 만족한다(fixtures.ts 주석 참고) — 이 시나리오의 발행 대상으로 쓴다.

async function loginAsAdmin(page: import("@playwright/test").Page) {
  // 로그인 폼을 매번 거치지 않고 토큰을 직접 심는다 — 이 시나리오의 관심사는
  // 로그인이 아니라 발행 흐름이다(로그인 자체는 admin-login.spec.ts가 담당).
  await page.goto("/admin/login");
  await page.evaluate(() => {
    window.localStorage.setItem("festa.admin.accessToken", "mock-access-token");
  });
}

test("미발행 축제를 선택해 발행하면 상태가 발행됨으로 바뀐다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/festivals");

  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();

  const checkbox = page.getByLabel("아카라카 2025 선택");
  await expect(checkbox).toBeVisible();
  await checkbox.check();

  await page.getByRole("button", { name: /1건 발행하기/ }).click();

  const outcome = page.getByRole("status");
  await expect(outcome).toContainText("요청 1건 중 1건 발행됨");

  // 발행 후 목록이 갱신되며 같은 행의 배지가 "발행됨"으로 바뀐다.
  const row = page.getByRole("row", { name: /아카라카 2025/ });
  await expect(row.getByText("발행됨")).toBeVisible();
});

test("발행 조건을 만족하지 않는 축제는 발행에 실패한다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/festivals");

  // festivalId 4 "라치오스 2025" — lineupCount 0으로 고정된 발행 불가 케이스.
  const checkbox = page.getByLabel("라치오스 2025 선택");
  await checkbox.check();
  await page.getByRole("button", { name: /1건 발행하기/ }).click();

  const outcome = page.getByRole("status");
  await expect(outcome).toContainText("1건 실패");
  await expect(outcome).toContainText("라치오스 2025");
});
