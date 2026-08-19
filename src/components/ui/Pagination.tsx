import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  /** 1-based */
  page: number;
  totalPages: number;
  totalElements: number;
  makeHref: (page: number) => string;
  className?: string;
};

/** 현재 페이지 주변 최대 5개 번호만 보여준다 (17 Festival List 시안) */
function pageWindow(current: number, total: number, size = 5): number[] {
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(size / 2);
  const start = Math.min(Math.max(1, current - half), total - size + 1);
  return Array.from({ length: size }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  makeHref,
  className = "",
}: Props) {
  const pages = pageWindow(page, totalPages);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={makeHref(page - 1)}
            aria-label="이전 페이지"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-muted"
          >
            <ChevronLeft size={18} aria-hidden />
          </Link>
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-muted-soft"
          >
            <ChevronLeft size={18} aria-hidden />
          </span>
        )}

        {pages.map((p) =>
          p === page ? (
            <span
              key={p}
              aria-current="page"
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-primary text-caption-strong text-on-primary"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={makeHref(p)}
              className="flex h-10 w-10 items-center justify-center rounded-pill text-caption-strong text-ink hover:bg-surface-field"
            >
              {p}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link
            href={makeHref(page + 1)}
            aria-label="다음 페이지"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-muted"
          >
            <ChevronRight size={18} aria-hidden />
          </Link>
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-muted-soft"
          >
            <ChevronRight size={18} aria-hidden />
          </span>
        )}
      </div>

      <p className="text-label-regular text-muted-soft">
        전체 {totalElements}개 · {page} / {totalPages} 페이지
      </p>
    </div>
  );
}
