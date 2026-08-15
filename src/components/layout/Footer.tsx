import Link from "next/link";
import { Container } from "./Container";

type FooterItem = { label: string; href: string | null };

const COLUMNS: { heading: string; items: FooterItem[] }[] = [
  {
    heading: "서비스",
    items: [
      { label: "축제", href: "/festivals" },
      { label: "아티스트", href: "/artists" },
      { label: "커뮤니티", href: null },
      { label: "분실물", href: "/lost-items" },
      { label: "캘린더", href: null },
    ],
  },
  {
    heading: "회사",
    items: [
      { label: "소개", href: null },
      { label: "공지사항", href: null },
      { label: "이용약관", href: null },
      { label: "개인정보처리방침", href: null },
    ],
  },
  {
    heading: "고객센터",
    items: [{ label: "문의하기", href: null }],
  },
];

export function Footer() {
  return (
    // 높이를 고정하지 않는다. 열이 접히면 그만큼 늘어난다.
    // 시안의 208은 1440에서 한 줄로 늘어섰을 때의 결과값이다.
    <footer className="shrink-0 border-t border-border bg-surface">
      <Container className="flex flex-wrap gap-x-12 gap-y-8 py-10">
        <div className="flex min-w-[240px] flex-col">
          <span className="text-logo-footer text-ink">FESTA</span>
          <span className="mt-4 text-meta text-muted">
            전국 대학 축제·페스티벌 라인업 아카이브
          </span>
          <span className="mt-2 text-label-regular text-muted-soft">
            © 2026 FESTA
          </span>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading} className="flex min-w-[120px] flex-col">
            <span className="text-nav-icon-label text-ink">
              {column.heading}
            </span>
            <ul className="mt-4 flex flex-col gap-3">
              {column.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-label-regular text-muted"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // MVP에 화면이 없는 항목. 링크로 만들면 404가 난다 (스펙 2.3)
                    <span className="text-label-regular text-muted">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 소셜 3개. DESIGN.md 828에서 아직 플레이스홀더(28 · r6 · border 채움)이고
            어느 채널인지 정해지지 않아 그대로 둔다. */}
        <div className="flex gap-3 sm:ml-auto">
          <span className="size-[28px] rounded-social bg-border" aria-hidden />
          <span className="size-[28px] rounded-social bg-border" aria-hidden />
          <span className="size-[28px] rounded-social bg-border" aria-hidden />
        </div>
      </Container>
    </footer>
  );
}
