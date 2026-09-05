import { test, expect, type Locator } from "@playwright/test";

// 접근성 작업(#94) 때 사람이 손으로 하던 확인을 자동으로 옮긴 자리다(#174).
//
// 그 작업의 기록에는 이렇게 남아 있다 — "자동화 도구의 프로그래밍적 .focus() 호출은
// 브라우저 :focus-visible / :focus-within 매칭에 필요한 실제 창 포커스를 만들지 못한다."
// Playwright의 keyboard.press("Tab")은 진짜 키 이벤트라 그 한계에 걸리지 않는다.
//
// 다만 toBeVisible()로는 판정할 수 없다. Tailwind의 sr-only는 요소를 없애는 게 아니라
// 1×1 크기로 줄이고 clip으로 가리는 것이라, Playwright는 그걸 "보인다"고 본다.
// 그래서 실제 렌더 크기로 가른다 — 이게 sr-only와 not-sr-only의 실제 차이다.

async function renderedWidth(locator: Locator) {
  const box = await locator.boundingBox();
  return box?.width ?? 0;
}

/** sr-only 상태의 상한. Tailwind sr-only는 1px로 줄인다 — 넉넉히 잡아도 4px을 넘지 않는다. */
const SR_ONLY_MAX_WIDTH = 4;

test("Tab 한 번이면 본문 바로가기가 나타나고 Enter로 본문에 닿는다", async ({ page }) => {
  await page.goto("/");

  const skipLink = page.getByRole("link", { name: "본문으로 바로가기" });
  // 접근성 트리에는 있다 — 스크린리더는 읽을 수 있어야 한다.
  await expect(skipLink).toHaveCount(1);
  // 그러나 화면에서는 1px로 접혀 있다.
  expect(await renderedWidth(skipLink)).toBeLessThanOrEqual(SR_ONLY_MAX_WIDTH);

  await page.keyboard.press("Tab");

  await expect(skipLink).toBeFocused();
  // focus:not-sr-only로 실제 크기를 갖는 버튼이 된다.
  expect(await renderedWidth(skipLink)).toBeGreaterThan(SR_ONLY_MAX_WIDTH);

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  // 링크가 가리키는 대상이 실제로 있어야 한다 — href만 맞고 id가 없으면 아무 데도 안 간다.
  await expect(page.locator("#main-content")).toBeVisible();
});

test("포커스가 떠나면 다시 접힌다 — 모든 화면 좌상단에 버튼이 남지 않는다", async ({ page }) => {
  await page.goto("/");
  const skipLink = page.getByRole("link", { name: "본문으로 바로가기" });

  await page.keyboard.press("Tab");
  expect(await renderedWidth(skipLink)).toBeGreaterThan(SR_ONLY_MAX_WIDTH);

  await page.keyboard.press("Tab");
  expect(await renderedWidth(skipLink)).toBeLessThanOrEqual(SR_ONLY_MAX_WIDTH);
});

test("본문 바로가기는 모든 사용자 화면에 있다 — 셸에 한 번 넣은 것이 전부에 걸린다", async ({
  page,
}) => {
  for (const path of ["/festivals", "/artists", "/search"]) {
    await page.goto(path);
    const skipLink = page.getByRole("link", { name: "본문으로 바로가기" });

    await page.keyboard.press("Tab");
    await expect(skipLink, `${path}에 본문 바로가기가 없다`).toBeFocused();
    expect(await renderedWidth(skipLink)).toBeGreaterThan(SR_ONLY_MAX_WIDTH);
  }
});
