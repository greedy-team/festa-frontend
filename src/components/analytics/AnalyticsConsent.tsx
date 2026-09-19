"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { analyticsPage } from "@/lib/analytics";
import {
  analyticsConsentAllows,
  readAnalyticsConsent,
  subscribeAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/analyticsConsent";
import { readSiteNoticeAcknowledged, subscribeSiteNotice } from "@/lib/siteNotice";
import { Analytics } from "./Analytics";

type Props = {
  enabled: boolean;
  gaMeasurementId?: string;
  clarityProjectId?: string;
};

export function AnalyticsConsent(props: Props) {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => null);
  // 약관 적용 고지(SiteNotice)를 확인하기 전에는 이 모달을 띄우지 않는다.
  // 둘 다 <dialog>라 동시에 열면 모달이 겹친다.
  const noticeAcknowledged = useSyncExternalStore(
    subscribeSiteNotice,
    readSiteNoticeAcknowledged,
    () => true,
  );
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const publicPage = analyticsPage(pathname) !== null;

  useEffect(() => {
    // noticeAcknowledged는 재실행을 걸기 위한 구독값이고, 판정은 저장소를 직접
    // 읽는다 — hydration 시점 스냅샷은 서버값(true)이라 그걸 믿으면 고지를 보기
    // 전에 이 모달이 먼저 열린다. 아래 consent도 같은 이유로 직접 읽는다.
    const acknowledged = readSiteNoticeAcknowledged();
    if (props.enabled && publicPage && acknowledged && readAnalyticsConsent() === null) {
      dialog.current?.showModal();
    } else if (!publicPage || !acknowledged) dialog.current?.close();
  }, [props.enabled, publicPage, noticeAcknowledged]);

  function choose(value: "all" | "ga" | "clarity" | "denied") {
    writeAnalyticsConsent(value);
    dialog.current?.close();
  }

  return (
    <>
      <Suspense fallback={null}>
        <Analytics
          {...props}
          consent={consent}
        />
      </Suspense>
      <dialog
        id="analytics-consent"
        ref={dialog}
        aria-labelledby="analytics-consent-title"
        aria-describedby="analytics-consent-description"
        onCancel={(event) => {
          event.preventDefault();
          if (consent === null) choose("denied");
          else dialog.current?.close();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100vw-32px))] overflow-y-auto rounded-card border border-border bg-surface p-6 text-ink backdrop:bg-black/40"
      >
        {/* 제목 태그가 아니다 — 이 모달은 모든 공개 페이지의 HTML에 들어가므로 h2로 두면 페이지마다
            서비스 내용과 무관한 제목이 하나씩 끼어든다(#259). 대화상자 이름은 aria-labelledby가 맡는다 */}
        <p id="analytics-consent-title" className="text-subtitle">더 편한 축제 탐색을 위한 분석</p>
        <p id="analytics-consent-description" className="mt-4 text-body">
          Google Analytics와 Microsoft Clarity로 방문 경로, 클릭·스크롤과 화면 이용 장면을 분석해 서비스를 개선합니다. 쿠키 등 브라우저 저장소를 사용하며, 검색어 원문은 분석에 보내지 않습니다.
        </p>
        <p className="mt-3 text-body">
          거부해도 모든 축제 정보를 볼 수 있습니다. 선택은 이 브라우저에 저장되며, 하단의 ‘분석 설정’에서 언제든 변경할 수 있습니다.
        </p>
        <Link href="/privacy" className="mt-4 inline-block text-body text-primary underline" onClick={() => dialog.current?.close()}>
          개인정보 처리방침 확인
        </Link>
        <form data-analytics-consent onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const ga = values.has("ga");
          const clarity = values.has("clarity");
          choose(ga && clarity ? "all" : ga ? "ga" : clarity ? "clarity" : "denied");
        }}>
          <label className="mt-4 flex min-h-[44px] items-center gap-3 text-body">
            <input type="checkbox" name="ga" defaultChecked={analyticsConsentAllows(consent, "ga")} className="size-[20px] accent-primary" />
            이용 통계 분석 (Google Analytics)
          </label>
          <label className="flex min-h-[44px] items-center gap-3 text-body">
            <input type="checkbox" name="clarity" defaultChecked={analyticsConsentAllows(consent, "clarity")} className="size-[20px] accent-primary" />
            화면 이용 분석 (Microsoft Clarity)
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="secondary-ink" className="flex-1" onClick={() => choose("denied")}>
              {consent !== null && consent !== "denied" ? "분석 동의 철회" : "거부"}
            </Button>
            <Button type="submit" className="flex-1">선택 저장</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
