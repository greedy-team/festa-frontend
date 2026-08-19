import Link from "next/link";
import type { UpcomingHostFestival } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, formatDday } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: UpcomingHostFestival;
};

/** upcoming-host-card (DESIGN.md) — 포스터 전면형 + 3단 스크림 */
export function UpcomingFestivalCard({ festival }: Props) {
  const { festivalId, name, posterUrl, startDate, endDate, dday } = festival;

  return (
    // 축제 상세(#45)가 develop에 아직 없어 임시로 홈에 연결한다
    <Link
      href="/"
      className={`relative flex h-[372px] w-[356px] max-w-full flex-col justify-end overflow-hidden rounded-card ${gridTint(festivalId)}`}
    >
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-scrim-35 via-scrim-25 to-transparent" />

      <span className="absolute right-4 top-4 rounded-pill border border-on-media bg-white/20 px-3 py-1 text-caption text-on-media">
        {formatDday(dday)}
      </span>

      <div className="relative z-10 flex flex-col gap-1 p-6">
        <h3 className="text-card-title text-on-media">{name}</h3>
        <p className="text-caption-strong text-on-media/85">
          {dateRange(startDate, endDate)}
        </p>
        <span className="mt-2 text-caption-strong text-on-media">자세히 보기 →</span>
      </div>
    </Link>
  );
}
