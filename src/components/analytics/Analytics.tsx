"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ANALYTICS_EVENT, analyticsIds, analyticsLink, analyticsPage, analyticsRecordingAllowed, analyticsReferrer, type AnalyticsEvent } from "@/lib/analytics";
import { analyticsConsentAllows, readAnalyticsConsent, type AnalyticsConsent } from "@/lib/analyticsConsent";
import { installAnalyticsBoundary } from "@/lib/analyticsBoundary";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

type Props = {
  enabled: boolean;
  consent: AnalyticsConsent;
  gaMeasurementId?: string;
  clarityProjectId?: string;
};

export function Analytics({ enabled, consent, gaMeasurementId, clarityProjectId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPage = useRef<string | null>(null);
  const ids = analyticsIds(gaMeasurementId, clarityProjectId);
  const allowed = enabled && analyticsPage(pathname) !== null;
  const gaAllowed = allowed && analyticsConsentAllows(consent, "ga");
  const clarityAllowed = allowed && analyticsConsentAllows(consent, "clarity") &&
    typeof window !== "undefined" && analyticsRecordingAllowed(window.location.href, document.referrer);
  const navigation = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (!enabled) return;
    return installAnalyticsBoundary(ids.ga);
  }, [enabled, ids.ga]);

  useEffect(() => {
    if (ids.ga) {
      Object.assign(window, { [`ga-disable-${ids.ga}`]: !gaAllowed });
    }
    if (!gaAllowed) {
      lastPage.current = null;
      return;
    }
    const page = analyticsPage(window.location.pathname);
    if (!page || !ids.ga || lastPage.current === navigation) return;

    window.dataLayer ??= [];
    // Google 기본 스니펫과 동일하게 arguments를 큐에 넣는다.
    window.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params -- gtag의 공식 큐 형식
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (lastPage.current === null) {
      window.gtag("js", new Date());
    }
    window.gtag("config", ids.ga, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ...page,
      page_referrer: analyticsReferrer(document.referrer),
    });
    window.gtag("event", "page_view", { ...page, send_to: ids.ga });
    lastPage.current = navigation;
  }, [gaAllowed, ids.ga, navigation]);

  useEffect(() => {
    if (!gaAllowed || !ids.ga) return;
    function send(event: AnalyticsEvent) {
      const page = analyticsPage(window.location.pathname);
      if (!analyticsConsentAllows(readAnalyticsConsent(), "ga") || !page) return;
      const { name, ...parameters } = event;
      window.gtag?.("event", name, { ...parameters, ...page, send_to: ids.ga });
    }
    const onEvent = (event: Event) => send((event as CustomEvent<AnalyticsEvent>).detail);
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const officialType = link.dataset.analyticsOfficial;
      if (officialType === "homepage" || officialType === "instagram") {
        send({ name: "official_link_click", link_type: officialType });
      } else {
        const selected = analyticsLink(link.href, window.location.origin);
        if (selected) send(selected);
      }
    };
    window.addEventListener(ANALYTICS_EVENT, onEvent);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(ANALYTICS_EVENT, onEvent);
      document.removeEventListener("click", onClick, true);
    };
  }, [gaAllowed, ids.ga]);

  if (!allowed) return null;

  return (
    <>
      {gaAllowed && ids.ga ? (
        <Script id="festa-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${ids.ga}`} strategy="afterInteractive" />
      ) : null}
      {clarityAllowed && ids.clarity ? (
        <Script id="festa-clarity" strategy="afterInteractive">{`
          window.clarity = window.clarity || function() {
            (window.clarity.q = window.clarity.q || []).push(arguments);
          };
          window.clarity('consentv2', {analytics_Storage: 'granted', ad_Storage: 'denied'});
          var script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.clarity.ms/tag/${ids.clarity}';
          document.head.appendChild(script);
        `}</Script>
      ) : null}
    </>
  );
}
