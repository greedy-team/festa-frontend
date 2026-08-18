import type { UpcomingShow } from "@/features/artists/types";
import { UpcomingShowRow } from "./UpcomingShowRow";

type Props = {
  items: UpcomingShow[];
  total: number;
};

/** 응답이 5건 + 전체 건수만 준다. 전체 목록은 축제 목록 화면(artistId 필터)의 몫이라
 * 페이지네이션은 만들지 않는다. 그 화면이 develop에 아직 없어 "더 보기"는 링크 없이 건수만 둔다 (#47) */
export function UpcomingShowsSection({ items, total }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">예정 공연</h2>
        <span className="text-caption-strong text-muted-soft">전체 {total}건</span>
      </div>

      {items.length ? (
        <div className="mt-4 flex flex-col gap-3">
          {items.map((show) => (
            <UpcomingShowRow key={`${show.festivalId}-${show.day}`} show={show} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">예정된 공연이 없습니다.</p>
      )}
    </section>
  );
}
