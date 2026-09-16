import { afterEach, expect, it, vi } from "vitest";
import { ANALYTICS_CONSENT_KEY, parseAnalyticsConsent, readAnalyticsConsent, subscribeAnalyticsConsent, writeAnalyticsConsent } from "./analyticsConsent";

afterEach(() => vi.unstubAllGlobals());

it("알 수 없는 저장 값은 동의로 간주하지 않는다", () => {
  for (const value of [null, "true", "accepted", "", "{bad-json"]) {
    expect(parseAnalyticsConsent(value)).toBeNull();
  }
  expect(parseAnalyticsConsent("all")).toBe("all");
  expect(parseAnalyticsConsent("granted")).toBeNull();
  expect(parseAnalyticsConsent("denied")).toBe("denied");
});

it("허용·철회를 저장하고 현재 탭에 알리며 구독을 해제한다", () => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal("window", new EventTarget());
  const listener = vi.fn();
  const unsubscribe = subscribeAnalyticsConsent(listener);
  writeAnalyticsConsent("all");
  expect(readAnalyticsConsent()).toBe("all");
  writeAnalyticsConsent("denied");
  expect(storage.get(ANALYTICS_CONSENT_KEY)).toBe("denied");
  expect(listener).toHaveBeenCalledTimes(2);
  unsubscribe();
  writeAnalyticsConsent("denied");
  expect(listener).toHaveBeenCalledTimes(2);
});

it("저장소 접근이 차단되어도 거부 선택과 현재 문서의 재동의가 작동한다", () => {
  vi.stubGlobal("localStorage", {
    getItem: () => { throw new Error("SecurityError"); },
    setItem: () => { throw new Error("SecurityError"); },
  });
  vi.stubGlobal("window", new EventTarget());
  writeAnalyticsConsent("denied");
  expect(readAnalyticsConsent()).toBe("denied");
  writeAnalyticsConsent("ga");
  expect(readAnalyticsConsent()).toBe("ga");
  writeAnalyticsConsent("denied");
});

it("읽기만 가능한 저장소에서는 철회가 이전 동의에 덮이지 않는다", () => {
  const storage = new Map([[ANALYTICS_CONSENT_KEY, "all"]]);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: () => { throw new Error("QuotaExceededError"); },
    removeItem: (key: string) => storage.delete(key),
  });
  vi.stubGlobal("window", new EventTarget());
  writeAnalyticsConsent("denied");
  expect(readAnalyticsConsent()).toBe("denied");
  expect(storage.has(ANALYTICS_CONSENT_KEY)).toBe(false);
});
