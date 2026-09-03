import { Search } from "lucide-react";

type Props = {
  className?: string;
  /** 투명 헤더가 어두운 히어로 위에 떠 있을 때 — 흰색 + 불투명도로만 그린다 */
  onDark?: boolean;
  /**
   * 폭을 부모에 맞춘다. 모바일 드롭다운처럼 이미 폭이 확정된 자리에서 쓴다 —
   * className으로 `w-full`을 넘기면 여기 박힌 `w-[280px]`와 같은 width 유틸이라
   * 어느 쪽이 이길지 클래스 문자열 순서가 정하지 않는다. 분기를 명시적으로 둔다.
   */
  fullWidth?: boolean;
};

/** Nav 전용 실제 검색 폼 — GET 제출이라 JS 없이도 /search로 이동한다 (#53) */
export function NavSearchForm({
  className = "",
  onDark = false,
  fullWidth = false,
}: Props) {
  return (
    <form
      action="/search"
      className={`inline-flex h-[40px] items-center justify-between rounded-pill px-4 transition-colors duration-300 ${
        fullWidth ? "w-full" : "w-[280px] max-w-full"
      } ${
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
