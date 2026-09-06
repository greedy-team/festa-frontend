import Link from "next/link";
import type { UpcomingShow } from "@/features/artists/types";
import { gridTint } from "@/lib/posterTint";
import { fullDate, formatDday } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";
import { Badge } from "@/components/ui/Badge";

type Props = {
  show: UpcomingShow;
};

/**
 * 예정 공연은 "가서 볼 것"이라 미래형·행동 유도형이다 — 축제 카드와 같은
 * 포스터 전면형으로 만들어 누르고 싶게 한다(출연 이력의 타임라인과 대비되는
 * 지점). festival-card와 같은 236:320 포스터 비율을 재사용해 낯설지 않게 한다.
 */
export function UpcomingShowCard({ show }: Props) {
  const { festivalId, name, hostName, venueName, posterUrl, performanceDate, day, dday } =
    show;

  return (
    <Link
      href={`/festivals/${festivalId}`}
      className="group flex w-[200px] shrink-0 flex-col"
    >
      <div
        className={`relative aspect-[236/320] w-full overflow-hidden rounded-media transition-transform duration-300 group-hover:scale-105 group-hover:shadow-hover motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Badge className="absolute left-3 top-3">{formatDday(dday)}</Badge>
      </div>

      {/* D-day가 공연일(performanceDate) 기준이라, 옆 날짜도 축제 전체 기간이
          아니라 실제 공연일을 보여준다 */}
      <span className="mt-3 truncate text-caption text-muted">
        DAY {day} · {fullDate(performanceDate)}
      </span>
      <h3 className="mt-1 truncate text-entity-name text-ink">{name}</h3>
      <span className="mt-1 truncate text-caption text-muted">
        {hostName} · {venueName}
      </span>
    </Link>
  );
}
