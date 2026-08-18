import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import type { UpcomingShow } from "@/features/artists/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, formatDday } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  show: UpcomingShow;
};

export function UpcomingShowRow({ show }: Props) {
  const { festivalId, name, hostName, venueName, posterUrl, startDate, endDate, dday } =
    show;

  return (
    // 축제 상세(#45)가 develop에 아직 없어 임시로 홈에 연결한다
    <Link
      href="/"
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
      <div
        className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-media ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-entity-name text-ink">{name}</h3>
        <p className="mt-1 flex items-center gap-1.5 truncate text-caption-strong text-muted">
          <Calendar size={14} className="shrink-0" aria-hidden />
          {dateRange(startDate, endDate)} · {hostName} · {venueName}
        </p>
      </div>

      {/* D-day는 축제 시작일이 아니라 이 아티스트의 공연일 기준이다 (#47 확정) */}
      <span className="shrink-0 rounded-pill bg-primary-soft px-3 py-1 text-meta-strong text-primary">
        {formatDday(dday)}
      </span>
      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
