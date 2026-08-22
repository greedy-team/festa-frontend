"use client";

import { usePathname } from "next/navigation";
import { MockProvider } from "@/mocks/MockProvider";
import { ADMIN_ROUTE_PREFIX } from "@/constants/routes";

type Props = {
  /**
   * Header·Footer를 여기서 import하지 않고 주입받는다.
   *
   * 이 파일은 "use client"라, 서버 컴포넌트를 **직접 import하면** 그것까지 클라이언트
   * 모듈 그래프에 들어간다. Footer와 그것이 쓰는 Container에는 "use client"가 없어
   * 지금까지 클라이언트 JS를 한 줄도 싣지 않았는데, 직접 import하면 공개 화면 전체에서
   * 번들에 실리게 된다. children·props로 건네받으면 서버 컴포넌트로 남는다.
   */
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

/**
 * 서비스 셸(Header·Footer·canvas 배경)을 그릴지 경로로 가른다.
 *
 * App Router의 root layout은 /admin/*까지 전부 감싸므로, 관리자 화면만 셸에서
 * 빼려면 여기서 가르거나 공개 라우트를 (main) 그룹으로 옮겨야 한다. 후자는 열린
 * PR들이 건드리는 폴더를 통째로 움직여야 해서 이번에는 택하지 않았다 —
 * (main) 정리는 별도 리팩토링 이슈다.
 */
export function SiteChrome({ header, footer, children }: Props) {
  const isAdmin = usePathname().startsWith(ADMIN_ROUTE_PREFIX);

  // 관리자는 자기 셸(사이드바)을 (console) 레이아웃에서 그린다.
  // 목은 공개 화면 전용이라 관리자 쪽에서는 MockProvider도 태우지 않는다.
  return isAdmin ? (
    <>{children}</>
  ) : (
    <div className="flex flex-1 flex-col bg-canvas">
      {header}
      <main className="flex-1">
        {/* MockProvider는 워커가 준비될 때까지 자식을 렌더하지 않는다.
            셸(Header·Footer)은 그 동안에도 보이게 children만 감싼다. */}
        {process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ? (
          <MockProvider>{children}</MockProvider>
        ) : (
          children
        )}
      </main>
      {footer}
    </div>
  );
}
