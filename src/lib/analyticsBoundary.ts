import { analyticsPage, analyticsRecordingAllowed } from "./analytics";
import { analyticsConsentAllows, readAnalyticsConsent, subscribeAnalyticsConsent } from "./analyticsConsent";

// 이미 내려받는 중인 태그까지 없애려면 해당 문서의 실행 수명을 끝내야 한다.
// 분석 동의 축소 또는 수집 제외 화면 진입에만 전체 탐색을 사용한다.
export function installAnalyticsBoundary(gaId: string | null) {
  let previous = readAnalyticsConsent();
  const hasGa = () => !!document.getElementById("festa-ga4");
  const hasClarity = () => !!document.getElementById("festa-clarity");
  const stop = () => {
    if (gaId) Object.assign(window, { [`ga-disable-${gaId}`]: true });
    window.dataLayer?.splice(0);
    window.clarity?.("stop");
  };
  const leave = (url: string, replace = false) => {
    stop();
    window.stop();
    if (replace) window.location.replace(url);
    else window.location.assign(url);
  };
  const needsDocument = (href: string) => {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return (hasGa() && !analyticsPage(url.pathname)) ||
      (hasClarity() && !analyticsRecordingAllowed(url.href));
  };
  const unsubscribe = subscribeAnalyticsConsent(() => {
    const next = readAnalyticsConsent();
    const reduced = (hasGa() && analyticsConsentAllows(previous, "ga") && !analyticsConsentAllows(next, "ga")) ||
      (hasClarity() && analyticsConsentAllows(previous, "clarity") && !analyticsConsentAllows(next, "clarity"));
    previous = next;
    if (!reduced) return;
    stop();
    // 같은 도메인의 분석 쿠키만 정리한다. 관리자 인증 정보는 대상이 아니다.
    const domains = window.location.hostname.split(".");
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^(_ga(?:_|$)|_clck$|_clsk$)/.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (let i = 0; i < domains.length - 1; i++) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domains.slice(i).join(".")}`;
      }
    }
    window.stop();
    window.location.reload();
  });
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    if (needsDocument(anchor.href)) {
      event.preventDefault();
      event.stopPropagation();
      leave(anchor.href);
    }
  };
  const onSubmit = (event: SubmitEvent) => {
    if (event.target instanceof HTMLFormElement && event.target.hasAttribute("data-analytics-consent")) return;
    if (hasClarity()) stop();
  };
  const onPopState = () => { if (needsDocument(window.location.href)) leave(window.location.href, true); };
  const push = window.history.pushState;
  const replace = window.history.replaceState;
  const wrap = (original: History["pushState"], replacing: boolean): History["pushState"] => function (data, unused, url) {
    if (url && needsDocument(String(url))) { leave(new URL(String(url), location.href).href, replacing); return; }
    original.call(window.history, data, unused, url);
  };
  const wrappedPush = wrap(push, false);
  const wrappedReplace = wrap(replace, true);
  window.history.pushState = wrappedPush;
  window.history.replaceState = wrappedReplace;
  document.addEventListener("click", onClick, true);
  document.addEventListener("submit", onSubmit, true);
  window.addEventListener("popstate", onPopState, true);
  return () => {
    unsubscribe();
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("submit", onSubmit, true);
    window.removeEventListener("popstate", onPopState, true);
    if (window.history.pushState === wrappedPush) window.history.pushState = push;
    if (window.history.replaceState === wrappedReplace) window.history.replaceState = replace;
    stop();
  };
}
