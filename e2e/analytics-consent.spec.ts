import { expect, test } from "@playwright/test";
import { gunzipSync } from "node:zlib";

test.skip(!process.env.ANALYTICS_E2E, "분석 활성 운영 조건 서버에서만 실행");

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/[^/]*(google-analytics\.com|clarity\.ms)\/(g\/)?collect.*/, (route) => route.fulfill({ status: 204, body: "" }));
  await page.route("https://c.clarity.ms/**", (route) => route.fulfill({ status: 204, body: "" }));
});

test("실제 Clarity 전송에서 본문·링크·입력의 테스트 문자열이 마스킹된다", async ({ page }) => {
  const payloads: string[] = [];
  await page.route(/https:\/\/[^/]*clarity\.ms\/collect.*/, async (route) => {
    const raw = route.request().postDataBuffer();
    if (raw) {
      const text = raw[0] === 31 && raw[1] === 139 ? gunzipSync(raw).toString() : raw.toString();
      JSON.parse(text);
      payloads.push(text);
    }
    await route.fulfill({ status: 204, body: "" });
  });
  await page.goto("/");
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.id = "analytics-mask-probe";
    link.href = "/search?q=PRIVATE_LINK_CANARY_233";
    link.textContent = "PRIVATE_TEXT_CANARY_233";
    link.title = "PRIVATE_TITLE_CANARY_233";
    link.setAttribute("aria-label", "PRIVATE_ARIA_CANARY_233");
    document.body.append(link);
  });
  await page.getByRole("checkbox", { name: "화면 이용 분석 (Microsoft Clarity)", exact: true }).check();
  await page.getByRole("button", { name: "선택 저장" }).click();
  await page.getByRole("searchbox", { name: "검색어", exact: true }).fill("PRIVATE_INPUT_CANARY_233");
  // 전송이 없어서 통과하는 것을 막고, 검사한 DOM 노드가 실제 페이로드에 있음을 확인한다.
  await expect.poll(() => payloads.some((text) => text.includes("analytics-mask-probe")), { timeout: 15_000 }).toBe(true);
  expect(payloads.join("\n")).not.toMatch(/PRIVATE_(LINK|TEXT|TITLE|ARIA|INPUT)_CANARY_233/);
});

test("다른 탭의 철회를 수신하면 기존 분석 문서도 종료한다", async ({ page, context }) => {
  await page.route("https://www.googletagmanager.com/gtag/**", (route) => route.fulfill({ body: "", contentType: "application/javascript" }));
  await page.goto("/");
  await page.getByRole("checkbox", { name: "이용 통계 분석 (Google Analytics)", exact: true }).check();
  await page.getByRole("button", { name: "선택 저장" }).click();
  await expect(page.locator("#festa-ga4")).toHaveCount(1);
  const other = await context.newPage();
  await other.goto("/privacy");
  await other.getByRole("button", { name: "분석 설정", exact: true }).click();
  await Promise.all([
    page.waitForEvent("load"),
    other.getByRole("button", { name: "분석 동의 철회" }).click(),
  ]);
  await expect(page.locator("#festa-ga4, #festa-clarity")).toHaveCount(0);
  await other.close();
});

test("저장된 동의가 있어도 검색은 Clarity, 정책은 모든 태그를 제외한다", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("festa.analytics-consent.v1", "all"));
  await page.route("https://www.googletagmanager.com/gtag/**", (route) => route.fulfill({ body: "", contentType: "application/javascript" }));
  await page.goto("/search?q=PRIVATE_CANARY_233");
  await expect(page.locator("#festa-ga4")).toHaveCount(1);
  await expect(page.locator("#festa-clarity")).toHaveCount(0);
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("link", { name: "개인정보 처리방침", exact: true }).click(),
  ]);
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator("#festa-ga4, #festa-clarity")).toHaveCount(0);
});

test("분석 기본값은 미선택이며 개별 허용·새로고침·철회가 유지된다", async ({ page }) => {
  await page.goto("/");
  if (await page.getByRole("dialog").isVisible()) await page.getByRole("button", { name: "거부", exact: true }).click();
  await page.getByRole("button", { name: "분석 설정", exact: true }).click();
  const ga = page.getByRole("checkbox", { name: "이용 통계 분석 (Google Analytics)", exact: true });
  const clarity = page.getByRole("checkbox", { name: "화면 이용 분석 (Microsoft Clarity)", exact: true });
  await expect(ga).not.toBeChecked();
  await expect(clarity).not.toBeChecked();
  await ga.check();
  await page.getByRole("button", { name: "선택 저장" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "분석 설정", exact: true }).click();
  await expect(ga).toBeChecked();
  await expect(clarity).not.toBeChecked();
  await page.getByRole("button", { name: "분석 동의 철회" }).click();
  await page.reload();
  await page.getByRole("button", { name: "분석 설정", exact: true }).click();
  await expect(ga).not.toBeChecked();
  await expect(clarity).not.toBeChecked();
});

test("모바일 모달은 화면 안에 들어오고 Escape로 동의 없이 닫힌다", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  if (await page.getByRole("dialog").isVisible()) await page.getByRole("button", { name: "거부", exact: true }).click();
  const trigger = page.getByRole("button", { name: "분석 설정", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("#festa-ga4, #festa-clarity")).toHaveCount(0);
});

for (const stage of ["tag", "sdk"] as const) {
  test(`지연된 Clarity ${stage} 응답은 철회 후 실행되지 않는다`, async ({ page }) => {
    let release: (() => Promise<void>) | undefined;
    let reached: () => void = () => {};
    const pending = new Promise<void>((resolve) => { reached = resolve; });
    await page.route("https://c.clarity.ms/**", (route) => route.fulfill({ status: 204, body: "" }));
    await page.route(stage === "tag" ? "https://www.clarity.ms/tag/**" : "https://scripts.clarity.ms/**", (route) => {
      release = () => route.fulfill({ status: 200, contentType: "application/javascript", body: "window.LATE_TAG_EXECUTED=true;" }).catch(() => {});
      reached();
    });
    await page.goto("/");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("checkbox", { name: "화면 이용 분석 (Microsoft Clarity)", exact: true }).check();
    await page.getByRole("button", { name: "선택 저장" }).click();
    await pending;
    await page.getByRole("button", { name: "분석 설정", exact: true }).click();
    await Promise.all([page.waitForEvent("load"), page.getByRole("button", { name: "분석 동의 철회" }).click()]);
    expect(release).toBeDefined();
    await release!();
    await expect(page.locator("#festa-clarity")).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>).LATE_TAG_EXECUTED)).toBeUndefined();
    expect(await page.evaluate(() => window.clarity)).toBeUndefined();
  });
}
