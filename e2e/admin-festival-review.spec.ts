import { test, expect, type Locator, type Page } from "@playwright/test";

// 검수 화면은 실 API(adminFetch)를 부르고, 목 모드에서는 MSW 핸들러
// (src/mocks/handlers/adminFestivals.ts)가 받는다. 응답은 실서버에서 떠온 픽스처
// (src/mocks/fixtures/adminFestivals.ts)라 필드 모양이 서버와 같다.
//
// 축제명은 하드코딩하지 않는다(DEC-0134). 화면에서 조건에 맞는 행을 찾아 이름을 읽어 두고,
// 액션 뒤 "그 이름의 행"이 기대한 상태로 바뀌었는지 본다. 전제는 픽스처 첫 페이지에
// 세 경우(발행 가능·발행 차단·발행됨)가 모두 있다는 것 하나다 — 깨지면 스킵이 아니라 실패다.
//
// 핸들러의 발행 상태는 페이지 JS 모듈 스코프에 있어 **전체 로드(page.goto·GET 폼 제출)마다
// 초기화된다.** 테스트 간 격리는 그걸로 얻고, 한 테스트 안에서 상태를 이어 보려면
// FilterChip(next/link) 같은 클라이언트 네비게이션만 써야 한다.

async function loginAsAdmin(page: Page) {
  // 로그인 흐름은 admin-login.spec.ts가 담당한다 — 여기선 토큰만 심는다.
  await page.goto("/admin/login");
  await page.evaluate(() => {
    window.localStorage.setItem("festa.admin.accessToken", "mock-access-token");
  });
}

/** 행의 첫 셀 제목(축제명). FestivalReviewTable의 name 셀 구조에 의존한다. */
function nameOf(row: Locator) {
  return row.locator("td").first().locator("p").first();
}

function rowNamed(page: Page, name: string) {
  return page.getByRole("row").filter({ has: page.getByText(name, { exact: true }) });
}

/** `발행` 버튼(정확히 그 이름 — "축제 등록"·"발행됨" 칩과 구분)이 주어진 상태인 첫 행 */
function firstRowWithPublishButton(page: Page, state: ":enabled" | ":disabled") {
  const button = page.getByRole("button", { name: "발행", exact: true }).and(page.locator(state));
  return page.getByRole("row").filter({ has: button }).first();
}

test("발행 가능한 미발행 축제를 발행하면 그 행이 발행됨으로 바뀐다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/festivals");
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();

  // 활성화된 "발행" 버튼이 있는 첫 행 — 차단 사유가 없는 미발행 축제다.
  const row = firstRowWithPublishButton(page, ":enabled");
  await expect(row).toBeVisible();
  const name = await nameOf(row).innerText();
  await expect(row.getByText("미발행")).toBeVisible();

  await row.getByRole("button", { name: "발행", exact: true }).click();

  // 발행 후 목록이 다시 불려오며 같은 이름의 행이 발행됨 배지와 해제 버튼을 갖는다.
  const after = rowNamed(page, name);
  await expect(after.getByText("발행됨")).toBeVisible();
  await expect(after.getByRole("button", { name: "해제" })).toBeVisible();
  await expect(after.getByRole("button", { name: "발행", exact: true })).toHaveCount(0);
});

test("발행된 축제를 해제하면 그 행이 미발행으로 바뀐다", async ({ page }) => {
  await loginAsAdmin(page);
  // "발행됨" 필터가 아니라 전체 목록에서 한다 — 필터 안에서 해제하면 행이 목록에서 빠져
  // "사라졌다"만 남고, 그건 렌더 실패와 구분이 안 된다(LSN-0046). 전체 목록에서는 같은
  // 행이 미발행으로 바뀌는 것을 그 자리에서 본다.
  await page.goto("/admin/festivals");
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();

  const row = page.getByRole("row").filter({ has: page.getByRole("button", { name: "해제" }) }).first();
  await expect(row).toBeVisible();
  const name = await nameOf(row).innerText();
  await expect(row.getByText("발행됨")).toBeVisible();

  // 해제는 window.confirm을 거친다 (FestivalReviewTable) — 수락해야 요청이 나간다.
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: "해제" }).click();

  const after = rowNamed(page, name);
  await expect(after.getByText("미발행")).toBeVisible();
  await expect(after.getByRole("button", { name: "발행", exact: true })).toBeVisible();
  await expect(after.getByRole("button", { name: "해제" })).toHaveCount(0);
});

test("발행 조건을 못 채운 축제는 발행 버튼이 비활성이고 사유가 보인다", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/festivals?published=false");
  await expect(page.getByRole("heading", { name: "축제 검수" })).toBeVisible();

  const row = firstRowWithPublishButton(page, ":disabled");
  await expect(row).toBeVisible();

  // 사유 문구는 adminEnums.ts의 PUBLISH_BLOCKER_LABELS에서 온다 — 셋 중 하나가 있어야 한다.
  await expect(row.getByText(/라인업 없음|주최 미연결|좌표 없음/)).toBeVisible();
  // 비활성 버튼은 눌러도 요청이 나가지 않는다 — force로 눌러 보고 상태가 그대로인지 본다.
  await row.getByRole("button", { name: "발행", exact: true }).click({ force: true });
  await expect(row.getByText("미발행")).toBeVisible();
});
