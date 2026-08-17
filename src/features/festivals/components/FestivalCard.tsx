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
    // 상세 화면(DESIGN.md 08 Festival Detail)이 아직 없어 임시로 홈에 연결한다 (#42).
    <Link href="/" className="flex flex-col">
      {/* 포스터 비율 236:320 — festival-card 컴포넌트 스펙 (recent-card는 236:300) */}
      <div
        className={`relative aspect-[236/320] w-full overflow-hidden rounded-media ${gridTint(festivalId)}`}
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
