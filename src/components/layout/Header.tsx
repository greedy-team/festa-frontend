"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { NavSearchForm } from "./NavSearchForm";
import { SITE_NAME } from "@/lib/site";

const MENU = [
  { label: "홈", href: "/" },
  { label: "축제", href: "/festivals" },
  { label: "아티스트", href: "/artists" },
  { label: "분실물", href: "/lost-items" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 경로가 바뀌면(메뉴 클릭 등) 열린 드롭다운을 닫는다 — Header는
  // 라우트 이동에도 언마운트되지 않는 셸이라 상태가 그대로 남는다.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setIsMenuOpen(false);
  }

  return (
    <header className="relative h-[72px] shrink-0 border-b border-border bg-surface">
      {/* 로고와 메뉴 사이 간격은 화면이 넓을수록 벌린다.
          시안의 로고→첫 메뉴 거리는 그 프레임에서의 한 사례일 뿐이다. */}
      <Container className="flex h-full items-center gap-4 sm:gap-8 lg:gap-16">
        <Link href="/" className="shrink-0 text-logo text-ink">
          {SITE_NAME}
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 sm:flex sm:gap-6 lg:gap-10">
          {MENU.map((item) => {
            // 경계를 명시한다. `startsWith(item.href)`만으로는 나중에
            // `/festivals-archive`가 생겼을 때 "축제"가 같이 켜진다.
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return isActive ? (
              <Link
                key={item.href}
                href={item.href}
                aria-current="page"
                // 인디케이터는 글자 폭과 같은 너비 × 2px (DESIGN.md 819)
                className="relative shrink-0 text-nav-active text-primary after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 text-body text-muted"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-6">
          {/* 640px 미만에서는 네비 자체가 숨어 있으니(hidden sm:flex),
              그 자리를 대신할 햄버거 버튼을 연다. */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            className="text-ink sm:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* 검색은 실제로 /search로 이동한다 (#53). 좁은 화면에서는
              접어 자리를 아낀다. display 클래스는 래퍼에 건다 —
              NavSearchForm의 inline-flex와 충돌해서 className으로
              넘긴 hidden이 밀린다. */}
          {/* 알림·북마크는 로그인을 전제하는데 MVP 이후 기능이라 뺐다.
              로그인이 생기면 그때 다시 넣는다. */}
          <span className="hidden lg:block">
            <NavSearchForm />
          </span>
        </div>
      </Container>

      {isMenuOpen ? (
        <div className="absolute inset-x-0 top-full z-20 border-b border-border bg-surface sm:hidden">
          <Container>
            <nav className="flex flex-col py-2">
              {MENU.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "py-3 text-nav-active text-primary"
                        : "py-3 text-body text-muted"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
