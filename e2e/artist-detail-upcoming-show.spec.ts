import { test, expect } from "@playwright/test";

// 아티스트마다 예정 공연이 있을 수도 없을 수도 있다(비수기엔 흔함). 목록에서
// 몇 명을 순서대로 열어보다가, 예정 공연이 있는 첫 아티스트를 찾으면 그 카드를
// 눌러 축제 상세로 실제 이동하는지까지 확인한다. 아무도 예정 공연이 없으면
// (실제 있을 수 있는 상태) 검증할 대상이 없다는 뜻이라 스킵한다.
test("예정 공연 카드를 누르면 해당 축제 상세로 이동한다", async ({ page }) => {
  await page.goto("/artists");

  const artistLinks = page.locator('a[href^="/artists/"]');
  // evaluateAll은 Playwright 자동 대기가 안 걸리는 API다 — 목록이 아직 안
  // 그려진 상태에서 바로 부르면 0개가 나와, 진짜 실패(목록 렌더링 자체가
  // 깨짐)도 "예정 공연 없음"과 똑같이 조용히 스킵돼버린다. 먼저 렌더를 기다린다.
  await expect(artistLinks.first()).toBeVisible();

  const hrefs = await artistLinks.evaluateAll((els) =>
    els.map((el) => el.getAttribute("href")).filter((href): href is string => !!href),
  );
  if (hrefs.length === 0) {
    throw new Error("아티스트 목록이 비어 있다 — 목록 렌더링이 실패했을 가능성이 높다");
  }

  const candidates = hrefs.slice(0, 10);
  for (const href of candidates) {
    await page.goto(href);

    const section = page.getByRole("heading", { name: "예정 공연" });
    await expect(section).toBeVisible();

    const showLink = page.locator('a[href^="/festivals/"]').first();
    if (await showLink.count()) {
      const festivalName = await showLink.locator("h3").innerText();

      await showLink.click();
      await expect(page).toHaveURL(/\/festivals\/\d+$/);
      // h1만 보이는지 확인하면 부족하다 — error.tsx·not-found.tsx도 h1을 그려서
      // 상세가 500·404여도 통과해버린다. 클릭한 카드의 이름과 실제로 일치하는지까지 본다.
      await expect(page.locator("h1")).toHaveText(festivalName);
      return;
    }
  }

  test.skip(true, "확인한 아티스트 중 예정 공연이 있는 경우가 없어 스킵");
});
