import Link from "next/link";

type Props = {
  href: string;
  active?: boolean;
  children: string;
};

// 기존 Chip은 <span>이라 클릭할 수 없다. 그 파일은 공개 화면이 쓰고 있으므로
// 건드리지 않고 관리자용을 따로 둔다.
export function FilterChip({ href, active = false, children }: Props) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "inline-flex h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-primary px-5 text-caption-strong text-on-primary"
          : "inline-flex h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border border-border bg-surface px-5 text-caption-strong text-muted hover:bg-surface-field"
      }
    >
      <span>{children}</span>
    </Link>
  );
}
