import Link from "next/link";
import type { Festival } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: Festival;
};

export function FestivalCard({ festival }: Props) {
  const { festivalId, name, startDate, endDate, posterUrl, host } = festival;

  return (
    <Link href={`/festivals/${festivalId}`} className="group flex flex-col">
      {/* 포스터 비율 236:320 — festival-card 컴포넌트 스펙 (recent-card는 236:300).
          hover 시 살짝 커지는 것 — DESIGN.md {elevation.hover}(카드 hover 그림자)를
          여기서 처음 실사용한다 */}
      <div
        className={`relative aspect-[236/320] w-full overflow-hidden rounded-media transition-transform duration-300 group-hover:scale-105 group-hover:shadow-hover motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${gridTint(festivalId)}`}
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
    </Link>
  );
}
