import { test, expect } from "@playwright/test";

// mock 계정은 src/mocks/handlers/adminAuth.ts의 DEV_ACCOUNT(admin/admin) 고정값이다.
// NEXT_PUBLIC_API_MOCKING=true일 때만 유효 — 로컬 .env.local, CI 워크플로우 둘 다 해당.

test("잘못된 자격증명으로 로그인하면 에러 문구가 뜬다", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("아이디").fill("wrong");
  await page.getByLabel("비밀번호").fill("wrong");
  await page.getByRole("button", { name: "로그인" }).click();

  // Next.js의 route announcer(#__next-route-announcer__)도 role="alert"라
  // getByRole("alert")만으로는 두 개가 잡힌다 — 폼의 에러 문단으로 좁힌다.
  await expect(page.locator('p[role="alert"]')).toHaveText(
    "아이디 또는 비밀번호가 올바르지 않습니다.",
  );
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("올바른 자격증명으로 로그인하면 콘솔로 이동한다", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("아이디").fill("admin");
  await page.getByLabel("비밀번호").fill("admin");
  await page.getByRole("button", { name: "로그인" }).click();

  // 로그인 폼도 SortDropdown(festivals-sort.spec.ts)과 같은 종류의 레이스가
  // 가능하다 — 컨트롤드 인풋 + onSubmit 전부 클라이언트 훅에 의존하고, root
  // layout이 /admin/*에도 공개 Header를 얹어 하이드레이션할 게 더 많다.
  // 콜드 서버 + CI 1 worker 조합에서 첫 케이스가 특히 취약해 여유를 둔다.
  await expect(page).toHaveURL(/\/admin\/festivals$/, { timeout: 15_000 });
  // FestivalReviewScreen의 h1은 목록 데이터 로딩 상태와 무관하게 즉시 렌더된다.
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();
});
