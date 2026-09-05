import { test, expect, type Page } from "@playwright/test";

// 번호 창 계산(pageWindow)은 유닛으로 덮었지만, 실제로 눌러서 다음 페이지가 오는지는
// 검증이 없었다(#174). 결과 0건일 때 에러 화면이 뜨던 #119와 같은 계열의 자리다.

const cards = (page: Page) => page.locator('a[href^="/festivals/"]');

/** 첫 카드의 href. getAttribute 전에 렌더를 기다린다(count()·evaluateAll은 자동 대기가 없다). */
async function firstCardHref(page: Page) {
  await expect(cards(page).first()).toBeVisible();
  return cards(page).first().getAttribute("href");
}

/**
 * 페이지 이동 뒤 목록이 실제로 갈릴 때까지 기다린다.
 *
 * next/link 소프트 내비게이션은 URL이 먼저 바뀌고 DOM이 뒤따른다. 클릭 직후 바로
 * 읽으면 이전 페이지의 카드가 그대로 잡혀 "안 바뀌었다"는 오탐이 난다.
 * not.toHaveAttribute는 자동 재시도라 갈릴 때까지 기다려 준다.
 */
async function expectListChangedFrom(page: Page, previousHref: string | null) {
  await expect(cards(page).first()).not.toHaveAttribute("href", previousHref ?? "");
}

test("다음 페이지로 이동하면 주소와 목록이 함께 바뀐다", async ({ page }) => {
  await page.goto("/festivals");
  const onPageOne = await firstCardHref(page);

  const pageTwo = page.getByRole("link", { name: "2", exact: true });
  // 목 데이터가 한 페이지 분량으로 줄면 스킵이 아니라 실패다 — 이 스펙이 조용히
  // 무력해지는 것을 막는다.
  await expect(pageTwo, "2페이지 링크가 없다 — 목 축제가 한 페이지 분량으로 줄었다").toBeVisible();

  await pageTwo.click();
  await expect(page).toHaveURL(/[?&]page=2/);
  await expectListChangedFrom(page, onPageOne);

  // 빈 상태나 에러 화면으로 빠지지 않았는지 (#119 재발 감시)
  await expect(page.getByText("등록된 축제가 없습니다")).toHaveCount(0);
  await expect(page.getByText("축제 정보를 불러오지 못했습니다")).toHaveCount(0);
});

test("이전 페이지로 돌아오면 1페이지 목록이 다시 온다", async ({ page }) => {
  await page.goto("/festivals?page=2");
  const onPageTwo = await firstCardHref(page);

  await page.getByRole("link", { name: "이전 페이지" }).click();
  await expect(page).toHaveURL(/\/festivals(\?|$)/);
  await expectListChangedFrom(page, onPageTwo);
});
