import { SITE_URL } from "./seo";

// 수집 화면과 질문의 근거: docs/adr/20260916_220_analytics_scope.md
export function analyticsPage(pathname: string) {
  const pages: Record<string, string> = {
    "/": "home",
    "/festivals": "festival_list",
    "/artists": "artist_list",
    "/search": "search",
  };
  let type = pages[pathname];
  if (/^\/festivals\/[1-9]\d*$/.test(pathname)) type = "festival_detail";
  if (/^\/artists\/[1-9]\d*$/.test(pathname)) type = "artist_detail";
  if (/^\/hosts\/[1-9]\d*$/.test(pathname)) type = "host_detail";
  if (/^\/hosts\/[1-9]\d*\/history$/.test(pathname)) type = "host_history";
  return type ? {
    page_location: `${SITE_URL}${pathname}`,
    page_title: type,
    page_type: type,
  } : null;
}

export function analyticsReferrer(referrer: string) {
  try {
    const url = new URL(referrer);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : "";
  } catch {
    return "";
  }
}

// Clarity는 DOM 마스킹과 별도로 원문 URL을 읽는다. URL 정제가 보장되지 않는 화면은 녹화하지 않는다.
export function analyticsRecordingAllowed(href: string, referrer = "") {
  try {
    const url = new URL(href);
    if (!analyticsPage(url.pathname) || url.pathname === "/search" || url.search || url.hash) return false;
    if (referrer) {
      const previous = new URL(referrer);
      if (previous.search || previous.hash || (previous.pathname !== "/" && !analyticsPage(previous.pathname))) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function analyticsIds(ga: string | undefined, clarity: string | undefined) {
  return {
    ga: ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : null,
    clarity: clarity && /^[a-z0-9]+$/.test(clarity) ? clarity : null,
  };
}

export type AnalyticsEvent =
  | { name: "select_content"; content_type: string; item_id: string }
  | { name: "official_link_click"; link_type: "homepage" | "instagram" }
  | { name: "search_results_view"; result_count: number; search_type: "ALL" | "ARTIST" | "HOST" | "FESTIVAL" };

export const ANALYTICS_EVENT = "festa:analytics-event";

export function reportAnalyticsEvent(event: AnalyticsEvent) {
  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: event }));
}

export function analyticsLink(href: string, origin: string) {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) return null;
    const page = analyticsPage(url.pathname);
    const match = url.pathname.match(/^\/(festivals|artists|hosts)\/([1-9]\d*)$/);
    return page && match ? {
      name: "select_content" as const,
      content_type: page.page_type,
      item_id: match[2],
    } : null;
  } catch {
    return null;
  }
}
