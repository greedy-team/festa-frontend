"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsIds, analyticsPage, analyticsReferrer } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

type Props = {
  enabled: boolean;
  consentGranted: boolean;
  gaMeasurementId?: string;
  clarityProjectId?: string;
};

export function Analytics({ enabled, consentGranted, gaMeasurementId, clarityProjectId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPage = useRef<string | null>(null);
  const ids = analyticsIds(gaMeasurementId, clarityProjectId);
  const allowed = enabled && consentGranted && analyticsPage(pathname) !== null;
  const navigation = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (ids.ga) {
      Object.assign(window, { [`ga-disable-${ids.ga}`]: !allowed });
    }
    if (!allowed) {
      window.clarity?.("stop");
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
  }, [allowed, ids.ga, navigation]);

  if (!allowed) return null;

  return (
    <>
      {ids.ga ? (
        <Script id="festa-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${ids.ga}`} strategy="afterInteractive" />
      ) : null}
      {ids.clarity ? (
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
