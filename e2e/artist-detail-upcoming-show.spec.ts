import { test, expect } from "@playwright/test";

// 아티스트마다 예정 공연이 있을 수도 없을 수도 있다(비수기엔 흔함). 목록에서
// 몇 명을 순서대로 열어보다가, 예정 공연이 있는 첫 아티스트를 찾으면 그 카드를
// 눌러 축제 상세로 실제 이동하는지까지 확인한다. 아무도 예정 공연이 없으면
// (실제 있을 수 있는 상태) 검증할 대상이 없다는 뜻이라 스킵한다.
test("예정 공연 카드를 누르면 해당 축제 상세로 이동한다", async ({ page }) => {
  await page.goto("/artists");
  const artistLinks = await page.locator('h3').evaluateAll((nodes) =>
    nodes.map((n) => n.closest("a")?.getAttribute("href")).filter((href): href is string => !!href),
  );

  const candidates = artistLinks.slice(0, 10);
  for (const href of candidates) {
    await page.goto(href);

    const section = page.getByRole("heading", { name: "예정 공연" });
    await expect(section).toBeVisible();

    const showLink = page.locator('a[href^="/festivals/"]').first();
    if (await showLink.count()) {
      await showLink.click();
      await expect(page).toHaveURL(/\/festivals\/\d+$/);
      await expect(page.locator("h1")).toBeVisible();
      return;
    }
  }

  test.skip(true, "확인한 아티스트 중 예정 공연이 있는 경우가 없어 스킵");
});
