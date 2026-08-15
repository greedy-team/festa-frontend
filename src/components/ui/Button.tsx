import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "reset";
type Size = "md" | "lg" | "sheet";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-surface text-primary border border-border",
  reset: "bg-surface text-muted border border-border",
};

const SIZE: Record<Size, string> = {
  md: "h-[48px] text-button",
  lg: "h-[52px] text-button",
  sheet: "h-[44px] text-button-sm",
};

// DESIGN.md 858: 시트 안의 secondary만 글자색이 ink다 (다른 곳은 인디고).
// 시안 불일치가 의심되나 확인 전까지 스펙대로 둔다.
// text-primary와 text-ink를 함께 내보내면 어느 쪽이 이길지 클래스 문자열 순서로
// 정해지지 않으므로, 충돌 클래스를 애초에 만들지 않고 통째로 교체한다.
const SHEET_SECONDARY = "bg-surface text-ink border border-border";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const variantClass =
    size === "sheet" && variant === "secondary"
      ? SHEET_SECONDARY
      : VARIANT[variant];

  return (
    <button
      // px-6(24px)는 DESIGN.md에 없는 기본값이다. 시안은 버튼마다 폭을
      // 고정값으로 주므로 패딩이 명시되지 않았다. 폭을 주면 무시된다.
      // cursor-pointer는 Tailwind 4가 preflight에서 button의 커서를 브라우저
      // 기본값(화살표)으로 두기 때문에 필요하다. v3까지는 자동이었다.
      className={`inline-flex cursor-pointer items-center justify-center rounded-md px-6 ${variantClass} ${SIZE[size]} ${className}`}
      {...props}
    />
  );
}
