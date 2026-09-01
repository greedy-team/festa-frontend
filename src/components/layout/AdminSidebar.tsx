"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_HOME, ADMIN_ROUTES } from "@/constants/routes";
import { clearToken } from "@/features/admin/auth/token";

// built: false인 항목은 아직 라우트가 없다 — 클릭하면 헤더·푸터·사이드바 없는
// 루트 not-found.tsx로 떨어진다. 링크로 두지 않고 span으로 렌더해 존재하지 않는
// 경로를 광고하지 않는다.
const NAV_ITEMS = [
  { href: ADMIN_ROUTES.imports, label: "크롤링 임포트", built: true },
  { href: ADMIN_ROUTES.festivals, label: "축제 검수", built: true },
  { href: ADMIN_ROUTES.artists, label: "아티스트", built: true },
  { href: ADMIN_ROUTES.hosts, label: "주최", built: true },
  { href: ADMIN_ROUTES.lostItems, label: "분실물", built: false },
] as const;

type Props = {
  /** 서랍으로 열렸을 때만 넘어온다 — 고정 열일 때는 닫을 대상이 없다 */
  onClose?: () => void;
};

export function AdminSidebar({ onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  function handleLogout() {
    clearToken();
    // QueryClient는 app/admin/providers.tsx에서 만들어져 클라이언트 네비게이션 사이에
    // 살아남는다 — 지우지 않으면 다음 로그인 직후 이전 세션의 캐시된 데이터가 refetch
    // 전까지 잠깐 그대로 보인다.
    queryClient.clear();
    router.replace(ADMIN_ROUTES.login);
  }

  return (
    <nav className="flex w-[224px] shrink-0 flex-col gap-1 bg-admin-shell p-4">
      <div className="mb-6 flex items-center justify-between">
        <Link href={ADMIN_HOME} className="px-3 py-2">
          <span className="text-logo-footer text-white">FESTA</span>
          <span className="ml-1 text-label-regular text-admin-shell-muted">ADMIN</span>
        </Link>
        {onClose === undefined ? null : (
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="flex size-[36px] cursor-pointer items-center justify-center rounded-md text-admin-shell-ink"
          >
            <X size={20} aria-hidden />
          </button>
        )}
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return item.built ? (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-md bg-primary px-3 py-2 text-caption-strong text-on-primary"
                : "rounded-md px-3 py-2 text-caption-strong text-admin-shell-ink hover:bg-admin-shell-hover"
            }
          >
            {item.label}
          </Link>
        ) : (
          <span
            key={item.href}
            aria-disabled="true"
            title="아직 준비 중인 기능입니다"
            className="rounded-md px-3 py-2 text-caption-strong text-admin-shell-muted"
          >
            {item.label} · 준비 중
          </span>
        );
      })}

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex items-center rounded-md border-t border-admin-shell-hover px-3 pt-4 text-caption-strong text-admin-shell-muted hover:text-admin-shell-ink"
      >
        로그아웃
      </button>
    </nav>
  );
}
