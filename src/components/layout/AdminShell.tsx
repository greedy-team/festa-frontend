"use client";

import { useEffect } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useRouteResetState } from "@/lib/hooks/useRouteResetState";

/**
 * 관리자 콘솔의 셸. 사이드바를 넓은 화면에서는 고정 열로, 좁은 화면에서는 서랍으로 둔다.
 *
 * 사이드바가 224px 고정이라 좁은 화면에서 본문에 거의 아무것도 남지 않았다 — 375px에서
 * 본문 폭이 87px였다. 서랍으로 빼면 좁은 화면에서 본문이 전체 폭을 쓴다.
 *
 * 상태가 여기 사는 이유: 햄버거 버튼과 사이드바가 같은 열림 상태를 봐야 하는데 둘은
 * 형제라, 공통 조상이 들고 있어야 한다.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  // 항목을 누르면 이동은 되는데 서랍이 열린 채 남아 목적지를 가린다 — 경로가
  // 바뀌면 접는다 (패턴 설명은 useRouteResetState 참고).
  const [isDrawerOpen, setDrawerOpen] = useRouteResetState(() => false);

  // 서랍은 화면을 덮으므로 Esc로 닫히지 않으면 좁은 화면에서 갇힌 느낌이 된다.
  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  return (
    <div className="flex flex-1 flex-col bg-surface-field lg:flex-row">
      {/* 좁은 화면 전용 상단 바. lg 이상에서는 사이드바가 항상 보이므로 필요 없다 */}
      <div className="flex h-[56px] shrink-0 items-center gap-3 bg-admin-shell px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={isDrawerOpen}
          className="flex size-[40px] cursor-pointer items-center justify-center rounded-md text-admin-shell-ink"
        >
          <Menu size={22} aria-hidden />
        </button>
        <span className="text-logo-footer text-white">FESTA</span>
        <span className="text-label-regular text-admin-shell-muted">ADMIN</span>
      </div>

      {/* 서랍이 열렸을 때만 깔리는 막. 바깥을 눌러 닫는 통상적인 방법을 준다 */}
      {isDrawerOpen ? (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-10 cursor-default bg-black/50 lg:hidden"
        />
      ) : null}

      <div
        className={
          isDrawerOpen
            ? "fixed inset-y-0 left-0 z-20 flex lg:static lg:z-auto"
            : "hidden lg:static lg:flex"
        }
      >
        <AdminSidebar
          onClose={isDrawerOpen ? () => setDrawerOpen(false) : undefined}
        />
      </div>

      {/* 서랍이 열린 동안은 뒤에 깔린 본문을 스크린리더·탭 순서에서 뺀다 —
          오버레이는 시각적으로만 가릴 뿐 포커스 이동은 막지 않는다 */}
      <main aria-hidden={isDrawerOpen} className="min-w-0 flex-1 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
