import { test, expect } from "@playwright/test";

// #155 재현: lg(1024px) 미만에서 헤더 검색 폼이 접히는데(hidden lg:block) 그 자리를
// 대신할 진입로가 없어 검색 화면에 도달할 방법이 사라졌다. 폭 구간마다 진입 수단이
// 다르므로(햄버거 드롭다운 / 아이콘 / 헤더 폼) 각 구간에서 실제로 /search까지
// 가는지를 본다. 데이터 값이 아니라 "어느 폭에서든 도달 가능하다"는 구조만
// 검증한다 (DEC-0134).

test.describe("640px 미만 — 햄버거 드롭다운의 검색창", () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test("햄버거를 열어 검색하면 검색 결과 화면으로 간다", async ({ page }) => {
    await page.goto("/festivals");

    await page.getByRole("button", { name: "메뉴 열기" }).click();

    // 데스크톱 폼도 DOM에는 남아 있다(래퍼만 hidden) — 보이는 쪽만 고른다.
    const input = page.locator('header form[action="/search"]:visible input[name="q"]');
    await input.fill("축제");
    await input.press("Enter");

    await expect(page).toHaveURL(/\/search\?/);
    expect(new URL(page.url()).searchParams.get("q")).toBe("축제");
  });
});

test.describe("640~1023px — 검색 아이콘", () => {
  test.use({ viewport: { width: 768, height: 780 } });

  test("검색 아이콘을 누르면 검색 화면으로 간다", async ({ page }) => {
    await page.goto("/festivals");

    // 이 구간에는 햄버거가 없다(sm:hidden) — 아이콘이 유일한 진입로다.
    await expect(page.getByRole("button", { name: "메뉴 열기" })).toBeHidden();
    await page.getByRole("link", { name: "검색", exact: true }).click();

    await expect(page).toHaveURL(/\/search/);
    // 헤더 검색 폼 입력도 같은 "검색어" 라벨을 쓴다(이 폭에선 래퍼가 hidden이라
    // 안 보이지만 DOM에는 있다) — main으로 좁혀 페이지 입력만 고른다.
    await expect(page.getByRole("main").getByLabel("검색어")).toBeVisible();
  });
});

test.describe("1024px 이상 — 헤더 검색 폼", () => {
  test.use({ viewport: { width: 1280, height: 780 } });

  test("헤더 검색 폼으로 검색하면 검색 결과 화면으로 간다", async ({ page }) => {
    await page.goto("/festivals");

    const input = page.locator('header form[action="/search"]:visible input[name="q"]');
    await input.fill("축제");
    await input.press("Enter");

    await expect(page).toHaveURL(/\/search\?/);
    expect(new URL(page.url()).searchParams.get("q")).toBe("축제");
  });
});
