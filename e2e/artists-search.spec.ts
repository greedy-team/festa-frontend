import { test, expect } from "@playwright/test";

// 검색어를 하드코딩하지 않는다 — 목록의 첫 아티스트 이름 일부를 그대로 검색어로
// 써서, 실제 데이터가 바뀌어도 "검색하면 그 이름이 결과에 남는다"는 구조만
// 검증한다.
test("아티스트를 검색하면 결과가 검색어로 좁혀진다", async ({ page }) => {
  await page.goto("/artists");

  const firstName = await page.locator("h3").first().innerText();
  const query = firstName.slice(0, Math.min(2, firstName.length));

  // 같은 검색 폼이 모바일/데스크톱 두 벌로 DOM에 동시에 있고 한쪽은
  // 반응형으로 숨겨져 있다 — 실제로 보이는 쪽만 골라서 채운다.
  const searchInput = page.locator('input[placeholder="아티스트 이름 검색"]:visible');
  await searchInput.fill(query);
  await searchInput.press("Enter");

  // encodeURIComponent는 ( ) . * ! 를 인코딩하지 않는다 — 그 문자가 들어간
  // 검색어(예: "(여자)아이들")로 정규식을 만들면 괄호가 안 닫힌 채로 깨진다.
  // URL을 파싱해서 실제 값으로 비교하면 인코딩 규칙을 신경 쓸 필요가 없다.
  expect(new URL(page.url()).searchParams.get("q")).toBe(query);
  await expect(page.locator("h3").first()).toContainText(query);
});
