import { test, expect } from "@playwright/test";

test("통합 검색에서 검색어를 입력하면 결과 화면으로 이동한다", async ({ page }) => {
  await page.goto("/search");

  // 버튼을 누르는 대신 Enter로 제출한다 — nav에도 같은 "검색" 라벨의 버튼이
  // 있어서 getByRole("button", { name: "검색" })이 두 개를 잡아버린다.
  const searchField = page.getByLabel("검색어");
  await searchField.fill("아");
  await searchField.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=/);
  // URL만 보면 부족하다 — 검색 API가 실패해도 같은 URL에서 "검색 결과를
  // 불러오지 못했습니다"를 그린다(search/page.tsx). 결과 헤딩이
  // "{q}" 검색 결과 {n}건 형식이라(같은 파일), 데이터 값을 하드코딩하지 않고도
  // 실제로 결과가 왔는지까지 확인할 수 있다.
  await expect(page.getByText(/검색 결과 \d+건/)).toBeVisible();
});

// #145 재현: 타입 칩으로 좁혔을 때 그 타입 매치가 0건이면 헤더도 0건이고 빈 상태
// 안내가 떠야 한다. 이 스위트 방침대로 검색어를 하드코딩하지 않고, 아티스트 목록의
// 첫 이름을 실행 시점에 읽어 쓴다 — 아티스트로는 반드시 매치되므로, ALL 결과에서
// 섹션이 안 그려진(=그 타입 0건인) 칩으로 옮겨가 회귀를 잡는다.
test("타입 칩으로 좁혀 그 타입 결과가 0건이면 헤더도 0건이고 빈 상태 안내가 뜬다", async ({
  page,
}) => {
  await page.goto("/artists");
  const query = (
    await page.getByRole("heading", { level: 3 }).first().textContent()
  )?.trim();
  expect(query).toBeTruthy();

  await page.goto(`/search?q=${encodeURIComponent(query!)}`);
  await expect(
    page.getByRole("heading", { level: 2, name: "아티스트" }),
  ).toBeVisible();

  // ALL 응답에서 섹션이 안 그려진 타입 = 그 타입 매치 0건. 칩 라벨 "학교"가
  // 사이트에서 유일해 HOST를 우선 쓰고, 그마저 매치되면 FESTIVAL로 넘어간다.
  const hostShown = await page
    .getByRole("heading", { level: 2, name: "학교" })
    .isVisible();
  const festivalShown = await page
    .getByRole("heading", { level: 2, name: "축제" })
    .isVisible();
  const emptyType = !hostShown ? "HOST" : !festivalShown ? "FESTIVAL" : null;
  test.skip(
    emptyType === null,
    "첫 아티스트 이름이 세 타입 모두에 매치돼 0건인 타입을 고를 수 없음",
  );

  await page.click(`a[href*="type=${emptyType}"]`);

  await expect(page.getByText(/검색 결과 0건/)).toBeVisible();
  await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
});
