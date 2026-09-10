"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
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

  // 히어로 위에서도 조금만 내리면 솔리드로 바꾼다. 히어로가 화면 높이를 통째로
  // 채우기 때문에, 히어로 하단이 헤더를 지나는 순간(overHero)만 기다리면 한 화면을
  // 다 내려야 헤더가 변한다 — 그 사이 내내 흰 글자가 포스터 위에 떠 있다.
  // 임계값을 넘으면 아래 transition-colors(300ms)가 색을 서서히 넘긴다.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 80);
    };
    // 스크롤은 프레임보다 자주 발생한다 — rAF로 한 프레임에 한 번만 재계산한다.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update(); // 스크롤된 채로 새로고침한 경우(브라우저 스크롤 복원)
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  // 드롭다운이 열리면 투명 상태에서도 솔리드로 — 흰 패널 위에 흰 글씨가 뜨지 않게.
  const solid = !overHero || scrolled || isMenuOpen;

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
      {/* 3열 그리드: 로고(좌) · 메뉴(중앙) · 검색·햄버거(우).
          양옆 열이 같은 1fr이라 가운데 열이 헤더 정중앙에 온다 — 로고 폭과 우측
          그룹 폭이 서로 달라도 메뉴 위치는 안 흔들린다. minmax(0,1fr)로 두는 이유는
          그냥 1fr이면 내용보다 좁아지지 못해서 검색 폼(280px)이 있는 우측 열이
          더 넓어지고, 그만큼 가운데가 왼쪽으로 밀리기 때문이다.
          각 칸에 col-start를 못박는 이유: 640px 미만에서 nav가 display:none이 되면
          자동 배치가 우측 그룹을 2번 칸으로 당겨온다. */}
      <Container className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-6">
        <Link
          href="/"
          className={`col-start-1 justify-self-start text-logo transition-colors duration-300 ${
            solid ? "text-ink" : "text-on-media"
          }`}
        >
          {SITE_NAME}
        </Link>

        <nav className="col-start-2 hidden min-w-0 items-center gap-3 sm:flex sm:gap-8 lg:gap-12">
          {/* 히어로 위에서는 인디고를 쓰지 않는다 — 흰색 + 불투명도만 (DESIGN.md Don'ts).
              활성 인디케이터는 글자 폭과 같은 너비 × 2px (DESIGN.md 819) */}
          <NavLinks
            pathname={pathname}
            // hover 시 살짝 커진다. font-size가 아니라 scale이라 인접 메뉴·활성
            // 밑줄이 밀리지 않는다. transition-colors 대신 transition으로 색·크기를
            // 함께 전환하고, 동작 줄이기에서는 hover:scale-100으로 확대만 끈다
            // (색 전환은 헤더 다른 곳과 같이 유지 — #94 관례의 scale 부분만 적용).
            linkClassName={(isActive) =>
              isActive
                ? `relative shrink-0 text-nav-active transition duration-300 hover:scale-[1.15] motion-reduce:hover:scale-100 after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-full after:transition-colors after:duration-300 ${
                    solid
                      ? "text-primary after:bg-primary"
                      : "text-on-media after:bg-on-media"
                  }`
                : `shrink-0 text-body transition duration-300 hover:scale-[1.15] motion-reduce:hover:scale-100 ${
                    solid ? "text-muted" : "text-on-media/75"
                  }`
            }
          />
        </nav>

        <div className="col-start-3 flex shrink-0 items-center justify-self-end gap-3 sm:gap-4 lg:gap-6">
          {/* 640~1023px 구간 전용 검색 진입로. 이 구간은 검색 폼이 접혀 있는데
              (hidden lg:block) 햄버거도 없어서(sm:hidden) 드롭다운에 검색을 넣는
              방식으로는 덮이지 않는다 — 아이콘 하나로 /search에 보낸다 (#155).
              44px는 모바일 터치 타깃 하한이다(DESIGN.md Touch Targets). */}
          <Link
            href="/search"
            aria-label="검색"
            className={`hidden size-[44px] items-center justify-center transition-colors duration-300 sm:flex lg:hidden ${
              solid ? "text-ink" : "text-on-media"
            }`}
          >
            <Search size={24} aria-hidden />
          </Link>
          {/* 640px 미만에서는 네비 자체가 숨어 있으니(hidden sm:flex),
              그 자리를 대신할 햄버거 버튼을 연다. */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            className={`flex size-[44px] items-center justify-center transition-colors duration-300 sm:hidden ${
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
            {/* 640px 미만에서 유일한 검색 진입로 (#155). 아이콘으로 /search에
                보내는 대신 입력을 그대로 놓는다 — 열려 있는 패널이라 자리가 있고,
                GET 폼이라 JS 없이도 제출된다. 제출하면 라우트가 바뀌어
                useRouteResetState가 드롭다운을 닫는다. */}
            <div className="pt-3">
              <NavSearchForm fullWidth />
            </div>
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
