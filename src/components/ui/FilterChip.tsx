import Link from "next/link";

type Props = {
  href: string;
  active?: boolean;
  /** 건수. 픽스처에서 파생한 값을 받는다 — 상수를 넣지 않는다 (LSN-0018) */
  count?: number;
  children: string;
};

// 기존 Chip은 <span>이라 클릭할 수 없다. 그 파일은 공개 화면이 쓰고 있으므로
// 건드리지 않고 관리자용을 따로 둔다.
export function FilterChip({ href, active = false, count, children }: Props) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={count === undefined ? undefined : `${children}, ${count}건`}
      className={
        active
          ? "inline-flex h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-primary px-5 text-caption-strong text-on-primary"
          : "inline-flex h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-border bg-surface px-5 text-caption-strong text-muted hover:bg-surface-field"
      }
    >
      <span>{children}</span>
      {count === undefined ? null : <span aria-hidden>{count}</span>}
    </Link>
  );
}
