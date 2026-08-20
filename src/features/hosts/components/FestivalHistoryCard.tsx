import Link from "next/link";
import { gridTint } from "@/lib/posterTint";
import { dateRange, festivalSeason } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

// 카드가 실제로 쓰는 필드만 받는다 — 목록의 Festival(host 포함)과 주최 상세의
// HostFestivalHistoryItem(host 없음) 양쪽 다 이 모양을 구조적으로 만족한다.
type CardFestival = {
  festivalId: number;
  name: string;
  startDate: string;
  endDate: string;
  posterUrl: string | null;
};

type Props = {
  festival: CardFestival;
};

/** festival-card와 크기는 같지만 학교명 대신 계절 표기를 쓴다 — 이 화면이 이미 한 학교로 고정돼 있어서다 */
export function FestivalHistoryCard({ festival }: Props) {
  const { festivalId, name, startDate, endDate, posterUrl } = festival;

  return (
    <Link href={`/festivals/${festivalId}`} className="flex flex-col">
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
