import type { ReactNode } from "react";

type Variant = "primary" | "success" | "on-media";

const VARIANT_CLASSES: Record<Variant, string> = {
  // badge-dday · badge-day
  primary: "bg-primary-soft text-primary text-meta-strong",
  // badge-status
  success: "bg-success-soft text-success-ink text-label",
  // badge-dday-on-media — 포스터 위 전용
  "on-media": "bg-white/20 border border-on-media text-on-media text-caption",
};

type Props = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function Badge({
  variant = "primary",
  className = "",
  children,
}: Props) {
  return (
    // px-3(12px)는 DESIGN.md에 없는 기본값이다. 시안은 높이만 28로 고정하고
    // 폭은 내용에 맡긴다. badge-day(64×28)는 className으로 폭을 준다.
    <span
      className={`inline-flex h-[28px] items-center justify-center rounded-pill px-3 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
