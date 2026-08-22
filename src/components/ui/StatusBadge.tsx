type Tone = "success" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-soft text-success-ink",
  warning: "bg-warning-soft text-warning-ink",
  danger: "bg-danger-soft text-danger-ink",
  neutral: "bg-neutral-soft text-neutral-ink",
};

type Props = {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

// 기존 Badge는 변형이 primary/success/on-media 3종뿐이고 서비스 화면 전용이다.
// 관리자는 상태 가짓수가 많아 tone을 따로 둔다.
export function StatusBadge({
  tone = "neutral",
  className = "",
  children,
}: Props) {
  return (
    <span
      className={`inline-flex h-[28px] items-center justify-center rounded-pill px-3 text-label ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
