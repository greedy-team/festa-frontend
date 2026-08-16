import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
};

export function HeroArrow({ direction, onClick, disabled = false }: Props) {
  const label = direction === "prev" ? "이전" : "다음";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      // 히어로 위에 떠 있는 컨트롤이다. 그림자 없이 흰 채움만으로 분리한다
      className="inline-flex size-[48px] cursor-pointer items-center justify-center rounded-pill bg-surface text-ink disabled:opacity-40"
    >
      {direction === "prev" ? (
        <ChevronLeft size={20} aria-hidden />
      ) : (
        <ChevronRight size={20} aria-hidden />
      )}
    </button>
  );
}
