import Link from "next/link";

type Props = {
  title: string;
  /** 목적지가 아직 없으면 생략한다. 링크를 그리지 않는다 */
  href?: string | null;
  className?: string;
};

export function SectionHeaderRow({ title, href = null, className = "" }: Props) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <h2 className="text-section-title-home text-ink">{title}</h2>
      {href ? (
        <Link href={href} className="shrink-0 text-caption-strong text-muted">
          전체 보기 →
        </Link>
      ) : null}
    </div>
  );
}
