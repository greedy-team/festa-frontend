import Link from "next/link";
import { Container } from "./Container";
import { SITE_NAME } from "@/lib/site";

type FooterItem = { label: string; href: string };

// MVP에 화면이 없는 항목(커뮤니티·캘린더·소개·공지사항·이용약관·
// 개인정보처리방침·문의하기)은 뺐다. 화면이 생기면 그때 다시 넣는다.
const LINKS: FooterItem[] = [
  { label: "축제", href: "/festivals" },
  { label: "아티스트", href: "/artists" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // 높이를 고정하지 않는다. 열이 접히면 그만큼 늘어난다.
    // 시안의 208은 1440에서 한 줄로 늘어섰을 때의 결과값이다.
    <footer className="shrink-0 border-t border-border bg-surface">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-10">
        <span className="text-logo text-ink">{SITE_NAME}</span>

        <span className="text-body text-muted-soft">
          © {currentYear} {SITE_NAME}
        </span>

        <ul className="flex flex-wrap items-center gap-x-8">
          {LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-body text-muted underline underline-offset-2"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
