import { afterEach, beforeEach, expect, it, vi } from "vitest";

// 모듈이 저장소 차단 상태를 모듈 변수로 들고 있어서 테스트끼리 샌다.
// 매번 새로 import해 그 상태까지 초기화한다.
async function freshModule() {
  vi.resetModules();
  return import("./siteNotice");
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

it("확인을 저장하고 현재 탭에 알리며 구독을 해제한다", async () => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal("window", new EventTarget());
  const notice = await freshModule();

  expect(notice.readSiteNoticeAcknowledged()).toBe(false);
  const listener = vi.fn();
  const unsubscribe = notice.subscribeSiteNotice(listener);

  notice.acknowledgeSiteNotice();
  expect(storage.get(notice.SITE_NOTICE_KEY)).toBe("acknowledged");
  expect(notice.readSiteNoticeAcknowledged()).toBe(true);
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe();
  notice.acknowledgeSiteNotice();
  expect(listener).toHaveBeenCalledTimes(1);
});

it("저장된 값이 정확히 일치할 때만 확인으로 읽는다", async () => {
  for (const stored of [null, "", "true", "1", "Acknowledged", "acknowledged "]) {
    vi.stubGlobal("localStorage", { getItem: () => stored, setItem: () => {} });
    const notice = await freshModule();
    expect(notice.readSiteNoticeAcknowledged()).toBe(false);
  }
  vi.stubGlobal("localStorage", { getItem: () => "acknowledged", setItem: () => {} });
  const notice = await freshModule();
  expect(notice.readSiteNoticeAcknowledged()).toBe(true);
});

it("저장소가 막혀도 현재 문서에서는 확인을 유지한다", async () => {
  vi.stubGlobal("localStorage", {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
  });
  vi.stubGlobal("window", new EventTarget());
  const notice = await freshModule();

  expect(notice.readSiteNoticeAcknowledged()).toBe(false);
  notice.acknowledgeSiteNotice();
  expect(notice.readSiteNoticeAcknowledged()).toBe(true);
});

it("다른 탭에서 확인하면 구독자에게 알린다", async () => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  const window = new EventTarget();
  vi.stubGlobal("window", window);
  const notice = await freshModule();

  const listener = vi.fn();
  notice.subscribeSiteNotice(listener);

  storage.set(notice.SITE_NOTICE_KEY, "acknowledged");
  window.dispatchEvent(
    Object.assign(new Event("storage"), { key: notice.SITE_NOTICE_KEY }),
  );

  expect(listener).toHaveBeenCalledTimes(1);
  expect(notice.readSiteNoticeAcknowledged()).toBe(true);
});
