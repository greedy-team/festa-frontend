import { test, expect, type Page } from "@playwright/test";

// OS "동작 줄이기"를 켠 사용자에게는 애니메이션을 끈다(#94에서 motion-reduce: 25곳).
// 지금까지 수동 QA 항목이었는데, Playwright가 prefers-reduced-motion을 에뮬레이션할 수
// 있어 자동으로 옮긴다(#174).
//
// 핵심은 "애니메이션이 꺼지는 것"이 아니라 "꺼져도 내용이 그대로 남는 것"이다.
// FadeInSection은 기본 상태가 opacity-0(translate-y-6)이고 스크롤로 화면에 들어와야
// 보이게 되는데, motion-reduce에서는 opacity-100·translate-y-0으로 고정된다.
// 그 고정을 빼먹으면 동작만 꺼지는 게 아니라 콘텐츠가 아예 안 보인다.

/** 화면 아래쪽 FadeInSection 안의 요소 — 스크롤하지 않으면 기본값에서는 접혀 있다. */
function belowFoldSection(page: Page) {
  return page.getByRole("heading", { name: "최근 등록된 축제" });
}

/**
 * 그 요소를 감싼 FadeInSection 래퍼의 계산된 스타일.
 *
 * opacity로 판정하면 안 된다 — 700ms 전환 도중에 읽히면 0도 1도 아닌 중간값이 나온다
 * (실제로 0.766이 나와 대조군이 깨졌다).
 *
 * transition-duration도 아니다. Tailwind의 transition-none은 transition-property만
 * none으로 바꾸고 duration은 duration-700 그대로 둔다 — reduce를 켜도 0.7s로 읽힌다.
 * 실제로 갈리는 것은 transition-property다.
 */
async function wrapperStyle(page: Page) {
  return belowFoldSection(page).evaluate((el) => {
    const wrapper = el.closest("div.transition-all");
    if (!wrapper) return null;
    const s = getComputedStyle(wrapper);
    return { opacity: s.opacity, transitionProperty: s.transitionProperty };
  });
}

test("동작 줄이기를 켜면 스크롤 전에도 아래 섹션이 그대로 보인다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(belowFoldSection(page)).toBeVisible();
  // 클래스 존재가 아니라 계산된 값으로 본다.
  const style = await wrapperStyle(page);
  expect(style?.transitionProperty).toBe("none"); // motion-reduce:transition-none
  expect(style?.opacity).toBe("1"); // motion-reduce:opacity-100
});

test("동작 줄이기를 켜면 히어로 진입 애니메이션이 꺼져도 링크가 눌린다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const panel = page.locator('a[href^="/festivals/"]').first();
  await expect(panel).toBeVisible();
  await panel.click();
  await expect(page).toHaveURL(/\/festivals\/\d+$/);
  await expect(page.getByRole("heading", { name: "라인업" })).toBeVisible();
});

test("동작 줄이기를 켜면 상세 화면 진입 페이드인이 꺼져도 본문이 보인다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('a[href^="/festivals/"]').first().click();
  await expect(page).toHaveURL(/\/festivals\/\d+$/);

  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "라인업" })).toBeVisible();
});

// 대조군. 위 첫 번째가 "reduce라서 통과"한 것인지, 아니면 원래 늘 1인지를 가른다.
// 이게 없으면 motion-reduce:opacity-100을 지워도 첫 테스트가 통과할 수 있다.
test("동작 줄이기가 없으면 같은 섹션이 스크롤 전에 접혀 있다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  // 전환이 살아 있다 — motion-reduce:transition-none을 지우면 위 테스트가,
  // 여기가 none이 되면 이 테스트가 깨진다. 둘이 서로를 지킨다.
  expect((await wrapperStyle(page))?.transitionProperty).toBe("all");
});
