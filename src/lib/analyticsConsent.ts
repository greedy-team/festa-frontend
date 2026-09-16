export const ANALYTICS_CONSENT_KEY = "festa.analytics-consent.v1";
const CHANGE_EVENT = "festa:analytics-consent";
export type AnalyticsConsent = "all" | "ga" | "clarity" | "denied" | null;
let memoryConsent: AnalyticsConsent = null;
let storageWriteFailed = false;

export function parseAnalyticsConsent(value: string | null): AnalyticsConsent {
  return value === "all" || value === "ga" || value === "clarity" || value === "denied" ? value : null;
}

export function analyticsConsentAllows(consent: AnalyticsConsent, tool: "ga" | "clarity") {
  return consent === "all" || consent === tool;
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (storageWriteFailed) return memoryConsent;
  try {
    return parseAnalyticsConsent(localStorage.getItem(ANALYTICS_CONSENT_KEY));
  } catch {
    return memoryConsent;
  }
}

export function writeAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  memoryConsent = value;
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    storageWriteFailed = false;
  } catch {
    storageWriteFailed = true;
    try { localStorage.removeItem(ANALYTICS_CONSENT_KEY); } catch { /* 저장소 접근 자체가 차단됨 */ }
    // 저장소가 차단된 브라우저에서는 현재 문서에서만 선택을 유지한다.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeAnalyticsConsent(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CONSENT_KEY || event.key === null) {
      storageWriteFailed = false;
      listener();
    }
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
