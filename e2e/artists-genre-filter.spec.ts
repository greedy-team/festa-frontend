import { test, expect } from "@playwright/test";

// 이름 검색(artists-search)은 덮여 있었지만 장르 칩 필터는 검증이 없었다(#174).

test("장르 칩으로 좁히면 주소와 결과가 함께 바뀐다", async ({ page }) => {
  await page.goto("/artists");

  const rows = page.locator('a[href^="/artists/"]');
  // count()는 자동 대기가 없다 — 서버 렌더가 끝나기 전에 부르면 0이 나와,
  // 진짜 실패(목록 렌더가 깨짐)와 구분이 안 된다.
  await expect(rows.first()).toBeVisible();
  const rowsBefore = await rows.count();
  expect(rowsBefore).toBeGreaterThan(0);

  // "전체"가 아닌 첫 장르 칩. 어떤 장르인지는 고정하지 않는다 — 목 데이터가 바뀌어도
  // 스펙이 깨지지 않아야 한다.
  const genreChip = page
    .locator('a[href*="genre="]')
    .filter({ hasNot: page.getByText("전체", { exact: true }) })
    .first();
  await expect(genreChip).toBeVisible();
  const genreLabel = (await genreChip.innerText()).trim();

  await genreChip.click();
  await expect(page).toHaveURL(/[?&]genre=/);

  // 좁힌 결과가 0건이면 빈 상태 문구가, 아니면 목록이 있어야 한다. 어느 쪽이든
  // 에러 화면으로 빠지면 안 된다.
  const rowsAfter = await page.locator('a[href^="/artists/"]').count();
  if (rowsAfter === 0) {
    await expect(page.getByText(/해당하는 아티스트가 없습니다/)).toBeVisible();
  } else {
    expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
  }

  // 고른 칩이 화면에 남아 있는지 — 필터가 걸렸다는 것을 화면이 말해야 한다.
  // 같은 라벨이 좁은 화면용 <select>의 <option>에도 있어 텍스트로만 찾으면
  // 숨은 option이 잡힌다. 링크로 좁힌다.
  await expect(
    page.locator('a[href*="genre="]').filter({ hasText: genreLabel }).first(),
  ).toBeVisible();
});

test("전체 칩으로 돌아오면 필터가 풀린다", async ({ page }) => {
  await page.goto("/artists");

  const genreChip = page
    .locator('a[href*="genre="]')
    .filter({ hasNot: page.getByText("전체", { exact: true }) })
    .first();
  await genreChip.click();
  await expect(page).toHaveURL(/[?&]genre=/);

  await page.locator("a", { hasText: /^전체$/ }).first().click();
  await expect(page).not.toHaveURL(/[?&]genre=/);
});
