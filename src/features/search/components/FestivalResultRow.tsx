import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import type { FestivalResult } from "@/features/search/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, dDay } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: FestivalResult;
  /** 매칭 하이라이트 판단용 검색어 */
  query: string;
};

/**
 * 시안의 부분 문자열 하이라이트 대신, 학교명에서만 매칭됐을 때 한 줄로 알려주는
 * 걸로 단순화했다 (#53) — /search 응답이 어떤 필드에서 매칭됐는지 알려주지 않는다.
 */
export function FestivalResultRow({ festival, query }: Props) {
  const { festivalId, name, host, startDate, endDate, posterUrl } = festival;
  const q = query.trim();
  const matchedByHost = !name.includes(q) && host.name.includes(q);

  return (
    // 상세 화면(DESIGN.md 08 Festival Detail)이 아직 없어 임시로 홈에 연결한다.
    <Link
      href="/"
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
      <div
        className={`relative h-[88px] w-[80px] shrink-0 overflow-hidden rounded-md ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-row-title text-ink">{name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-caption-strong text-muted">
          <Calendar size={14} className="shrink-0" aria-hidden />
          {dateRange(startDate, endDate)} · {host.name}
        </p>
        {matchedByHost ? (
          <p className="mt-1 flex items-center gap-1.5 text-meta-medium text-primary">
            <span className="size-1 shrink-0 rounded-pill bg-accent" aria-hidden />
            학교명 일치: {host.name}
          </p>
        ) : null}
      </div>

      <span className="shrink-0 rounded-pill bg-primary-soft px-3 py-1 text-meta-strong text-primary">
        {dDay(startDate)}
      </span>
      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
