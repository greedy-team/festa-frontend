import { Search } from "lucide-react";

type Props = {
  className?: string;
  /** 투명 헤더가 어두운 히어로 위에 떠 있을 때 — 흰색 + 불투명도로만 그린다 */
  onDark?: boolean;
};

/** Nav 전용 실제 검색 폼 — GET 제출이라 JS 없이도 /search로 이동한다 (#53) */
export function NavSearchForm({ className = "", onDark = false }: Props) {
  return (
    <form
      action="/search"
      className={`inline-flex h-[40px] w-[280px] max-w-full items-center justify-between rounded-pill px-4 transition-colors duration-300 ${
        // 히어로 위에서는 인디고를 쓰지 않는다(DESIGN.md Don'ts) — 포커스 링도
        // 예외가 아니라 흰색으로 낸다.
        onDark
          ? "bg-white/15 focus-within:ring-2 focus-within:ring-on-media"
          : "bg-surface-field focus-within:ring-2 focus-within:ring-primary"
      } ${className}`}
    >
      <input
        type="search"
        name="q"
        placeholder="검색"
        className={`w-full bg-transparent text-caption transition-colors duration-300 focus:outline-none ${
          onDark
            ? "text-on-media placeholder:text-on-media/60"
            : "text-ink placeholder:text-muted-soft"
        }`}
      />
      <button
        type="submit"
        aria-label="검색"
        className={`shrink-0 cursor-pointer transition-colors duration-300 ${
          onDark ? "text-on-media/75" : "text-muted-soft"
        }`}
      >
        <Search size={16} aria-hidden />
      </button>
    </form>
  );
}
