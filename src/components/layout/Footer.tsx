import Link from "next/link";
import { Container } from "./Container";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

type FooterItem = { label: string; href: string };

// MVP에 화면이 없는 항목(커뮤니티·캘린더·소개·공지사항·이용약관·
// 개인정보처리방침·문의하기)은 뺐다. 화면이 생기면 그때 다시 넣는다.
const COLUMNS: { heading: string; items: FooterItem[] }[] = [
  {
    heading: "서비스",
    items: [
      { label: "축제", href: "/festivals" },
      { label: "아티스트", href: "/artists" },
      { label: "분실물", href: "/lost-items" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // 높이를 고정하지 않는다. 열이 접히면 그만큼 늘어난다.
    // 시안의 208은 1440에서 한 줄로 늘어섰을 때의 결과값이다.
    <footer className="shrink-0 border-t border-border bg-surface">
      <Container className="flex flex-wrap gap-x-12 gap-y-8 py-10">
        <div className="flex min-w-[240px] flex-col">
          <span className="text-logo-footer text-ink">{SITE_NAME}</span>
          <span className="mt-4 text-meta text-muted">{SITE_DESCRIPTION}</span>
          <span className="mt-2 text-[14px] font-normal text-muted-soft sm:text-label-regular">
            © {currentYear} {SITE_NAME}
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
                  <Link
                    href={item.href}
                    className="text-[14px] font-normal text-muted sm:text-label-regular"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </footer>
  );
}
