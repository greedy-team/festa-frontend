"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { NavSearchForm } from "./NavSearchForm";
import { useHeroVisibility } from "./HeroVisibilityContext";
import { useRouteResetState } from "@/lib/hooks/useRouteResetState";
import { isActiveRoute } from "@/lib/activeRoute";
import { SITE_NAME } from "@/lib/site";

const MENU = [
  { label: "홈", href: "/" },
  { label: "축제", href: "/festivals" },
  { label: "아티스트", href: "/artists" },
] as const;

/**
 * 메뉴 링크 목록. 데스크톱 nav와 모바일 드롭다운이 같은 활성 판정·마크업을 쓰고,
 * 다른 것은 링크에 붙는 클래스뿐이라 그 부분만 호출부가 넘긴다.
 */
function NavLinks({
  pathname,
  linkClassName,
}: {
  pathname: string;
  linkClassName: (isActive: boolean) => string;
}) {
  return (
    <>
      {MENU.map((item) => {
        const isActive = isActiveRoute(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={linkClassName(isActive)}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  // 경로가 바뀌면(메뉴 클릭 등) 열린 드롭다운을 닫는다 — Header는
  // 라우트 이동에도 언마운트되지 않는 셸이라 상태가 그대로 남는다.
  const [isMenuOpen, setIsMenuOpen] = useRouteResetState(() => false);
  // 홈 히어로(HeroSurface)가 헤더 아래에 깔려 있는 동안 true — 그때는 투명하게 그린다.
  const { overHero } = useHeroVisibility();

  // 드롭다운을 연 채로 창을 sm 이상으로 넓히면 햄버거 버튼도 드롭다운도
  // sm:hidden으로 사라진다 — 그런데 isMenuOpen은 true로 남아 헤더가 솔리드로
  // 고정되고 닫을 UI도 없다. 미디어 쿼리가 CSS로 숨기는 시점에 상태도 함께 닫는다.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 40rem)"); // Tailwind sm
    const close = () => {
      if (desktop.matches) setIsMenuOpen(false);
    };

    close(); // 하이드레이션 시점에 이미 넓은 경우
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
    // setIsMenuOpen은 useState의 setter라 안정적이다 — 훅을 거치면 lint가
    // 그걸 못 보므로 명시한다. 구독은 여전히 마운트 시 한 번만 걸린다.
  }, [setIsMenuOpen]);

  // 드롭다운이 열리면 투명 상태에서도 솔리드로 — 흰 패널 위에 흰 글씨가 뜨지 않게.
  const solid = !overHero || isMenuOpen;

  return (
    // sticky: 스크롤해도 상단에 붙는다. 히어로 위에서는 투명이었다가 지나가면
    // 흰 배경·테두리가 서서히(300ms) 나타난다. 높이 72는 HEADER_HEIGHT와 같은 값.
    <header
      className={`sticky top-0 z-30 h-[72px] shrink-0 border-b transition-colors duration-300 ${
        solid
          ? "border-border bg-surface"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* 로고와 메뉴 사이 간격은 화면이 넓을수록 벌린다.
          시안의 로고→첫 메뉴 거리는 그 프레임에서의 한 사례일 뿐이다. */}
      <Container className="flex h-full items-center gap-4 sm:gap-10 lg:gap-20">
        <Link
          href="/"
          className={`shrink-0 text-logo transition-colors duration-300 ${
            solid ? "text-ink" : "text-on-media"
          }`}
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 sm:flex sm:gap-8 lg:gap-12">
          {/* 히어로 위에서는 인디고를 쓰지 않는다 — 흰색 + 불투명도만 (DESIGN.md Don'ts).
              활성 인디케이터는 글자 폭과 같은 너비 × 2px (DESIGN.md 819) */}
          <NavLinks
            pathname={pathname}
            linkClassName={(isActive) =>
              isActive
                ? `relative shrink-0 text-nav-active transition-colors duration-300 after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-full after:transition-colors after:duration-300 ${
                    solid
                      ? "text-primary after:bg-primary"
                      : "text-on-media after:bg-on-media"
                  }`
                : `shrink-0 text-body transition-colors duration-300 ${
                    solid ? "text-muted" : "text-on-media/75"
                  }`
            }
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-6">
          {/* 640px 미만에서는 네비 자체가 숨어 있으니(hidden sm:flex),
              그 자리를 대신할 햄버거 버튼을 연다. */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            className={`transition-colors duration-300 sm:hidden ${
              solid ? "text-ink" : "text-on-media"
            }`}
          >
            {isMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
          {/* 검색은 실제로 /search로 이동한다 (#53). 좁은 화면에서는
              접어 자리를 아낀다. display 클래스는 래퍼에 건다 —
              NavSearchForm의 inline-flex와 충돌해서 className으로
              넘긴 hidden이 밀린다. */}
          {/* 알림·북마크는 로그인을 전제하는데 MVP 이후 기능이라 뺐다.
              로그인이 생기면 그때 다시 넣는다. */}
          <span className="hidden lg:block">
            <NavSearchForm onDark={!solid} />
          </span>
        </div>
      </Container>

      {isMenuOpen ? (
        <div className="absolute inset-x-0 top-full z-20 border-b border-border bg-surface sm:hidden">
          <Container>
            <nav className="flex flex-col py-2">
              {/* 드롭다운은 항상 흰 패널 위라 solid 분기가 없다 */}
              <NavLinks
                pathname={pathname}
                linkClassName={(isActive) =>
                  isActive
                    ? "py-3 text-nav-active text-primary"
                    : "py-3 text-body text-muted"
                }
              />
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
