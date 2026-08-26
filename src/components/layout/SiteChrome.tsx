"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTE_PREFIX } from "@/constants/routes";
import { HeroVisibilityContext } from "./HeroVisibilityContext";

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
  const pathname = usePathname();
  const isAdmin = pathname.startsWith(ADMIN_ROUTE_PREFIX);

  // 홈만 히어로(HeroSurface)가 헤더 아래까지 올라온다. 첫 렌더(SSR 포함)부터 투명으로
  // 그려야 로드·라우트 전환 직후 흰 헤더가 번쩍이지 않아서 경로로 초기값을 정하고,
  // 그 뒤의 스크롤 전환은 HeroSurface의 옵저버가 맡는다.
  const [overHero, setOverHero] = useState(() => pathname === "/");
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOverHero(pathname === "/");
  }

  // 관리자는 자기 셸(사이드바)을 (console) 레이아웃에서 그린다.
  return isAdmin ? (
    <>{children}</>
  ) : (
    <HeroVisibilityContext.Provider value={{ overHero, setOverHero }}>
      <div className="flex flex-1 flex-col bg-canvas">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
    </HeroVisibilityContext.Provider>
  );
}
