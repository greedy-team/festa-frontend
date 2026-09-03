import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import type { FestivalResult } from "@/features/search/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, dDay } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: FestivalResult;
};

/**
 * 시안엔 검색어 매칭 하이라이트가 있지만 뺐다 (#153) — /search 응답이 어떤 필드에서
 * 매칭됐는지 알려주지 않고, 학교명 매칭은 바로 위 메타 줄(· {학교명})과 겹친다.
 */
export function FestivalResultRow({ festival }: Props) {
  const { festivalId, name, host, startDate, endDate, posterUrl } = festival;

  return (
    <Link
      href={`/festivals/${festivalId}`}
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
      </div>

      <span className="shrink-0 rounded-pill bg-primary-soft px-3 py-1 text-meta-strong text-primary">
        {dDay(startDate)}
      </span>
      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
