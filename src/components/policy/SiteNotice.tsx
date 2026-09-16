"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { ADMIN_ROUTE_PREFIX } from "@/constants/routes";
import {
  acknowledgeSiteNotice,
  readSiteNoticeAcknowledged,
  subscribeSiteNotice,
} from "@/lib/siteNotice";

const POLICY_LINKS = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보 처리방침" },
] as const;

/**
 * 첫 방문에 약관·처리방침 적용을 한 번 알린다.
 *
 * 로그인이 없어 가입 절차에서 약관을 보여줄 자리가 없다. 그래서 계속 이용하는
 * 것을 약관 적용 확인으로 보고, 그 사실을 먼저 알린다. 이 모달은 고지이지
 * 개인정보 수집 동의가 아니다 — GA4·Clarity 같은 선택적 수집은 별도의 명시적
 * 선택(AnalyticsConsent)으로만 받는다.
 *
 * 관리자 화면에서는 띄우지 않는다. 운영자용 화면이라 이 고지의 대상이 아니다.
 */
export function SiteNotice() {
  const acknowledged = useSyncExternalStore(
    subscribeSiteNotice,
    readSiteNoticeAcknowledged,
    () => true,
  );
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const isAdmin = pathname.startsWith(ADMIN_ROUTE_PREFIX);
  // 고지가 가리키는 문서를 읽는 동안에는 그 위를 덮지 않는다. 링크로 나갔다가
  // 돌아오면 이 값이 true→false로 뒤집히면서 아래 효과가 다시 돌아 모달이 다시 뜬다
  // — 이 컴포넌트는 루트 레이아웃에 있어 라우트 이동에도 언마운트되지 않으므로,
  // 경로에서 파생된 값이 의존성에 없으면 효과가 영영 다시 돌지 않는다.
  const isPolicyPage = POLICY_LINKS.some((policy) => policy.href === pathname);

  useEffect(() => {
    if (!isAdmin && !isPolicyPage && !readSiteNoticeAcknowledged()) {
      // 이미 열린 dialog에 showModal을 다시 부르면 InvalidStateError가 난다.
      if (!dialog.current?.open) {
        dialog.current?.showModal();
        // showModal은 첫 포커스 가능 요소(= 이용약관 행)에 포커스를 준다. 그러면
        // 열자마자 그 행에만 포커스 링이 둘려 두 행이 다르게 보인다. 컨테이너로
        // 옮겨 링을 없애되, Tab을 누르면 행에 정상적으로 링이 생긴다.
        dialog.current?.focus();
      }
    } else dialog.current?.close();
  }, [isAdmin, isPolicyPage, acknowledged]);

  function confirm() {
    acknowledgeSiteNotice();
    dialog.current?.close();
  }

  return (
    <dialog
      id="site-notice"
      ref={dialog}
      tabIndex={-1}
      aria-labelledby="site-notice-title"
      aria-describedby="site-notice-description"
      onCancel={(event) => {
        // Escape로 닫아도 고지는 본 것이다. 계속 이용하면 약관이 적용된다는
        // 안내 자체가 목적이라 다시 띄우지 않는다.
        event.preventDefault();
        confirm();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100vw-32px))] overflow-y-auto rounded-card border border-border bg-surface p-6 text-ink backdrop:bg-black/40"
    >
      <h2 id="site-notice-title" className="text-subtitle">
        로그인 없이 바로 볼 수 있어요
      </h2>
      <p id="site-notice-description" className="mt-4 text-body">
        페스타는 회원가입 없이 모든 축제 정보를 볼 수 있어요. 계속 이용하면 아래
        두 문서에 동의한 것으로 봐요.
      </p>
      {/* 인라인 링크 대신 행으로 분리한다 — 눌러야 할 대상이라는 것이 먼저
          읽혀야 한다. 행 전체가 타깃이고 우측 chevron이 어포던스인 것은
          DayCard·ArtistRow·검색 결과 행과 같은 문법이다(hover가 없는 모바일에서는
          chevron이 유일한 어포던스라 뺄 수 없다). */}
      <ul className="mt-5 flex flex-col gap-2">
        {POLICY_LINKS.map((policy) => (
          <li key={policy.href}>
            <Link
              href={policy.href}
              onClick={() => dialog.current?.close()}
              className="flex min-h-[48px] items-center justify-between gap-2 rounded-row bg-primary-soft px-4 transition-[filter] hover:brightness-95"
            >
              <span className="text-body text-primary">{policy.label}</span>
              <ChevronRight size={16} className="shrink-0 text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <Button type="button" className="mt-6 w-full" onClick={confirm}>
        확인했어요
      </Button>
    </dialog>
  );
}
