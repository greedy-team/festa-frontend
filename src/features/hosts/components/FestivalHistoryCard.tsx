import Link from "next/link";
import type { Festival } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, festivalSeason } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: Festival;
};

/** festival-card와 크기는 같지만 학교명 대신 계절 표기를 쓴다 — 이 화면이 이미 한 학교로 고정돼 있어서다 */
export function FestivalHistoryCard({ festival }: Props) {
  const { festivalId, name, startDate, endDate, posterUrl } = festival;

  return (
    // 상세 화면(DESIGN.md 08 Festival Detail)이 아직 없어 임시로 홈에 연결한다 (#51).
    <Link href="/" className="flex flex-col">
      <div
        className={`relative aspect-[236/320] w-full overflow-hidden rounded-media ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <span className="mt-4 truncate text-label-regular text-muted">
        {festivalSeason(startDate)}
      </span>
      <h3 className="mt-1 truncate text-entity-name text-ink">{name}</h3>
      <span className="mt-2 text-label-regular text-muted-soft">
        {dateRange(startDate, endDate)}
      </span>
    </Link>
  );
}
