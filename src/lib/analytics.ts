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

export function analyticsIds(ga: string | undefined, clarity: string | undefined) {
  return {
    ga: ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : null,
    clarity: clarity && /^[a-z0-9]+$/.test(clarity) ? clarity : null,
  };
}
