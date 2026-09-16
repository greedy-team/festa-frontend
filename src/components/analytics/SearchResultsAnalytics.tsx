"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { reportAnalyticsEvent, type AnalyticsEvent } from "@/lib/analytics";
import { analyticsConsentAllows, readAnalyticsConsent, subscribeAnalyticsConsent } from "@/lib/analyticsConsent";

type Props = Omit<Extract<AnalyticsEvent, { name: "search_results_view" }>, "name">;

export function SearchResultsAnalytics({ result_count, search_type }: Props) {
  const searchParams = useSearchParams();
  const navigation = searchParams.toString();
  const last = useRef<string | null>(null);
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => null);
  const allowed = analyticsConsentAllows(consent, "ga");
  useEffect(() => {
    if (!allowed) { last.current = null; return; }
    const frame = requestAnimationFrame(() => {
      if (last.current === navigation) return;
      reportAnalyticsEvent({ name: "search_results_view", result_count, search_type });
      last.current = navigation;
    });
    return () => cancelAnimationFrame(frame);
  }, [allowed, navigation, result_count, search_type]);
  return null;
}
