"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

const SECTIONS = [
  { label: "토큰", href: "/showcase" },
  { label: "Button", href: "/showcase/button" },
  { label: "Badge", href: "/showcase/badge" },
  { label: "Chip", href: "/showcase/chip" },
  { label: "Hero", href: "/showcase/hero" },
  { label: "Card", href: "/showcase/card" },
] as const;

export default function ShowcaseLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <Container className="flex flex-wrap items-center gap-3 py-6">
        {SECTIONS.map((section) => {
          const isActive = pathname === section.href;

          return isActive ? (
            <Link
              key={section.href}
              href={section.href}
              className="inline-flex h-[36px] items-center rounded-pill bg-primary px-5 text-caption-strong text-on-primary"
            >
              {section.label}
            </Link>
          ) : (
            <Link
              key={section.href}
              href={section.href}
              className="inline-flex h-[36px] items-center rounded-pill border border-border bg-surface px-5 text-caption-strong text-muted"
            >
              {section.label}
            </Link>
          );
        })}
      </Container>
      {children}
    </div>
  );
}
