type Variant = "panel" | "banner";

const VARIANT = {
  panel: { height: "h-[420px]", size: "680 × 420" },
  banner: { height: "h-[96px]", size: "1280 × 96" },
} satisfies Record<Variant, { height: string; size: string }>;

type Props = {
  variant?: Variant;
  className?: string;
};

/** 항상 플레이스홀더다 — 광고 정책이 아직 없다 (DESIGN.md Known Gaps). */
export function AdSlot({ variant = "panel", className = "" }: Props) {
  const { height, size } = VARIANT[variant];

  return (
    <div
      className={`relative flex ${height} w-full items-center justify-center rounded-card border border-border-strong bg-surface-field ${className}`}
    >
      <span className="absolute left-5 top-5 flex h-[20px] w-[32px] items-center justify-center rounded-xs bg-muted-soft text-micro text-white">
        AD
      </span>
      <p className="text-button-sm text-muted-soft">광고 배너 영역 · {size}</p>
    </div>
  );
}
