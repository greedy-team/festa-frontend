import type { RecentFestival } from "@/features/home/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: RecentFestival;
};

export function RecentCard({ festival }: Props) {
  const { festivalId, name, startDate, endDate, posterUrl, host } = festival;

  return (
    <article className="flex flex-col">
      {/* 포스터 비율 236:300. 폭은 그리드가 정하므로 aspect로 높이를 잡는다.
          포스터 위에 상태 도트·D-day 뱃지를 얹지 않는다 (DESIGN.md) */}
      <div
        className={`relative aspect-[236/300] w-full overflow-hidden rounded-media ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <span className="mt-4 truncate text-label-regular text-muted">
        {host.name}
      </span>
      <h3 className="mt-1 truncate text-entity-name text-ink">{name}</h3>
      <span className="mt-2 text-label-regular text-muted-soft">
        {dateRange(startDate, endDate)}
      </span>
    </article>
  );
}
