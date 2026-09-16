import { afterEach, expect, it, vi } from "vitest";
import { installAnalyticsBoundary } from "./analyticsBoundary";
import { ANALYTICS_CONSENT_KEY, writeAnalyticsConsent } from "./analyticsConsent";

afterEach(() => vi.unstubAllGlobals());

function browser() {
  const data = new Map([[ANALYTICS_CONSENT_KEY, "all"]]);
  vi.stubGlobal("localStorage", { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v) });
  const location = { href: "https://www.every-festa.com/", origin: "https://www.every-festa.com", hostname: "www.every-festa.com", reload: vi.fn(), assign: vi.fn(), replace: vi.fn() };
  const history = { pushState: vi.fn(), replaceState: vi.fn() };
  const win = Object.assign(new EventTarget(), { location, history, stop: vi.fn(), clarity: vi.fn(), dataLayer: ["queued event"] });
  const doc = Object.assign(new EventTarget(), { getElementById: () => ({}), cookie: "_ga=123; _clck=456; admin-token=keep" });
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal("location", location);
  return { win, doc, history, location };
}

it("도구 하나만 철회해도 지연 태그가 남지 않게 문서를 종료한다", () => {
  const { win, location } = browser();
  const cleanup = installAnalyticsBoundary("G-TEST");
  writeAnalyticsConsent("ga");
  expect(location.reload).toHaveBeenCalledTimes(1);
  expect(win.stop).toHaveBeenCalled();
  expect(win.clarity).toHaveBeenCalledWith("stop");
  expect(win.dataLayer).toHaveLength(0);
  cleanup();
});

it("공개 탐색은 SPA를 유지하고 검색·정책 진입은 새 문서로 이동한다", () => {
  const { history, location } = browser();
  const originalPush = history.pushState;
  const cleanup = installAnalyticsBoundary("G-TEST");
  history.pushState({}, "", "/festivals/12");
  expect(originalPush).toHaveBeenCalledTimes(1);
  history.pushState({}, "", "/search?q=private");
  expect(originalPush).toHaveBeenCalledTimes(1);
  expect(location.assign).toHaveBeenCalledWith("https://www.every-festa.com/search?q=private");
  history.replaceState({}, "", "/privacy");
  expect(location.replace).toHaveBeenCalledWith("https://www.every-festa.com/privacy");
  cleanup();
  expect(history.pushState).toBe(originalPush);
});
