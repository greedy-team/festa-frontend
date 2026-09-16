"use client";

import { analyticsConsentAllows, readAnalyticsConsent } from "@/lib/analyticsConsent";

export function AnalyticsSettingsButton() {
  return (
    <button
      type="button"
      className="min-h-[44px] cursor-pointer text-body text-muted underline underline-offset-2"
      onClick={() => {
        const dialog = document.getElementById("analytics-consent");
        if (!(dialog instanceof HTMLDialogElement)) return;
        const consent = readAnalyticsConsent();
        for (const tool of ["ga", "clarity"] as const) {
          const input = dialog.querySelector<HTMLInputElement>(`input[name="${tool}"]`);
          if (input) input.checked = analyticsConsentAllows(consent, tool);
        }
        dialog.showModal();
      }}
    >
      분석 설정
    </button>
  );
}
