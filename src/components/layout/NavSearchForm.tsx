import { Search } from "lucide-react";

type Props = {
  className?: string;
};

/** Nav 전용 실제 검색 폼 — GET 제출이라 JS 없이도 /search로 이동한다 (#53) */
export function NavSearchForm({ className = "" }: Props) {
  return (
    <form
      action="/search"
      className={`inline-flex h-[40px] w-[280px] max-w-full items-center justify-between rounded-pill bg-surface-field px-4 ${className}`}
    >
      <input
        type="search"
        name="q"
        placeholder="검색"
        className="w-full bg-transparent text-caption text-ink placeholder:text-muted-soft focus:outline-none"
      />
      <button
        type="submit"
        aria-label="검색"
        className="shrink-0 cursor-pointer text-muted-soft"
      >
        <Search size={16} aria-hidden />
      </button>
    </form>
  );
}
