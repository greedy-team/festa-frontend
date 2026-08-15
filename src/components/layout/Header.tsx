"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark } from "lucide-react";
import { Container } from "./Container";
import { SearchPill } from "@/components/ui/SearchPill";

const MENU = [
  { label: "홈", href: "/" },
  { label: "축제", href: "/festivals" },
  { label: "아티스트", href: "/artists" },
  { label: "분실물", href: "/lost-items" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="h-[72px] shrink-0 border-b border-border bg-surface">
      {/* 로고와 메뉴 사이 간격은 화면이 넓을수록 벌린다.
          시안의 로고→첫 메뉴 거리는 그 프레임에서의 한 사례일 뿐이다. */}
      <Container className="flex h-full items-center gap-4 sm:gap-8 lg:gap-16">
        <Link href="/" className="shrink-0 text-logo text-ink">
          FESTA
        </Link>

        <nav className="flex min-w-0 items-center gap-3 sm:gap-6 lg:gap-10">
          {MENU.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

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
          {/* 검색과 알림·북마크는 좁은 화면에서 접는다. 셋 다 지금은 동작하지
              않는 표시 요소라 좁은 화면에서 자리를 차지할 이유가 없다.
              display 클래스는 래퍼에 건다 — SearchPill 기본 클래스의 inline-flex와
              충돌해서 className으로 넘긴 hidden이 밀린다. */}
          <span className="hidden lg:block">
            <SearchPill size="nav" />
          </span>
          {/* 알림·북마크·프로필은 로그인을 전제한다. MVP에 로그인이 없어
              링크가 아니라 표시 전용이다 (스펙 2.3). */}
          <span className="hidden text-muted sm:inline" aria-hidden>
            <Bell size={24} />
          </span>
          <span className="hidden text-muted sm:inline" aria-hidden>
            <Bookmark size={24} />
          </span>
          <span className="size-[36px] rounded-pill bg-primary" aria-hidden />
        </div>
      </Container>
    </header>
  );
}
