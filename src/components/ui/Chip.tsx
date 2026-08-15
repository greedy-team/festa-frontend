import type { ReactNode } from "react";

type Variant = "filter" | "sheet";

const STYLE = {
  // filter-chip 비활성 — h36 pill, 패딩 0 20 (DESIGN.md 명시)
  filter: "h-[36px] px-5 bg-surface border border-border text-muted text-caption-strong",
  // filter-chip 활성 — 인디고 채움, 테두리 없음
  "filter-active": "h-[36px] px-5 bg-primary text-on-primary text-caption-strong",
  // sheet-chip — h30. 패딩은 DESIGN.md에 없어 px-4(16px)를 기본값으로 둔다
  sheet: "h-[30px] px-4 bg-surface border border-border text-body-strong text-label-regular",
} as const;

type Props = {
  variant?: Variant;
  active?: boolean;
  className?: string;
  children: ReactNode;
};

export function Chip({
  variant = "filter",
  active = false,
  className = "",
  children,
}: Props) {
  const key = active && variant === "filter" ? "filter-active" : variant;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-pill ${STYLE[key]} ${className}`}
    >
      {children}
    </span>
  );
}
