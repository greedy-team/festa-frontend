import { randomInt } from "node:crypto";
import Image from "next/image";

type Variant = "panel" | "banner";

const AD_HREF = "https://docs.google.com/forms/d/1z2Cvhk7p7ef6-TFNesqUrpqeg8Ha5OjQoyAVfvVeX7M/edit";
const PANEL_IMAGES = ["/ads/panel1.png", "/ads/panel2.png"] as const;

const VARIANT = {
  panel: { height: "h-[420px]" },
  banner: { height: "h-[96px]" },
} satisfies Record<Variant, { height: string }>;

type Props = {
  variant?: Variant;
  className?: string;
};

export function AdSlot({ variant = "panel", className = "" }: Props) {
  const { height } = VARIANT[variant];
  const imageSrc =
    variant === "banner" ? "/ads/banner.png" : PANEL_IMAGES[randomInt(PANEL_IMAGES.length)];

  return (
    <a
      href={AD_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="광고 페이지 열기"
      className={`relative flex ${height} w-full items-center justify-center overflow-hidden rounded-card border border-border-strong bg-surface-field ${className}`}
    >
      <span className="absolute left-5 top-5 z-10 flex h-[20px] w-[32px] items-center justify-center rounded-xs bg-muted-soft text-micro text-white">
        AD
      </span>
      <Image src={imageSrc} alt="" fill sizes="100vw" className={variant === "panel" ? "object-cover" : "object-contain"} />
    </a>
  );
}
