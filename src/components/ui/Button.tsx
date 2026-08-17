import type { ButtonHTMLAttributes } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "reset"
  | "secondary-ink";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "border border-border bg-surface text-primary",
  reset: "border border-border bg-surface text-muted",
  "secondary-ink": "border border-border bg-surface text-ink",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-[44px] text-button-sm",
  md: "h-[48px] text-button",
  lg: "h-[52px] text-button",
};

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
  return (
    <button
      // px-6(24px)는 DESIGN.md에 없는 기본값이다. 시안은 버튼마다 폭을
      // 고정값으로 주므로 패딩이 명시되지 않았다. 폭을 주면 무시된다.
      // cursor-pointer는 Tailwind 4가 preflight에서 button의 커서를 브라우저
      // 기본값(화살표)으로 두기 때문에 필요하다. v3까지는 자동이었다.
      className={`inline-flex cursor-pointer items-center justify-center rounded-md px-6 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    />
  );
}
