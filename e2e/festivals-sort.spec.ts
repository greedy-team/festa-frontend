import { test, expect } from "@playwright/test";

// 축제 목록의 검색 pill(SearchPill)은 아직 표시 전용(aria-hidden)이라 이 화면의
// 실제 조작 가능한 필터는 정렬 드롭다운뿐이다 — 그래서 시나리오는 "검색"이
// 아니라 "정렬 변경"이다.
test("축제 목록에서 정렬을 바꾸면 URL과 목록이 갱신된다", async ({ page }) => {
  await page.goto("/festivals");

  await expect(page.getByRole("heading", { name: "축제 전체" })).toBeVisible();

  await page.getByLabel("정렬").selectOption("UPCOMING");

  // SortDropdown은 제출 버튼 없이 select의 onChange → requestSubmit()으로만
  // 제출된다(components/ui/SortDropdown.tsx) — 하이드레이션이 끝나기 전에
  // selectOption이 실행되면 값만 바뀌고 네비게이션은 안 일어난다. 콜드 서버 +
  // CI의 1 worker 조합에서 특히 나올 수 있어 기본 5초보다 여유를 둔다.
  await expect(page).toHaveURL(/sort=UPCOMING/, { timeout: 15_000 });
  // 정렬을 바꾸면 page 파라미터가 함께 실리지 않는다(=1페이지로 리셋). SortDropdown 주석 참고.
  await expect(page).not.toHaveURL(/page=/);
});

test("축제 카드를 누르면 해당 축제 상세로 이동한다", async ({ page }) => {
  await page.goto("/festivals");

  const firstCard = page.locator('a[href^="/festivals/"]').first();
  await expect(firstCard).toBeVisible();
  const festivalName = await firstCard.locator("h3").innerText();

  await firstCard.click();

  await expect(page).toHaveURL(/\/festivals\/\d+$/);
  // h1만 보이는지 확인하면 부족하다 — error.tsx·not-found.tsx도 h1을 그려서
  // 상세가 500·404여도 통과해버린다. 클릭한 카드의 이름과 실제로 일치하는지까지 본다.
  await expect(page.locator("h1")).toHaveText(festivalName);
});
