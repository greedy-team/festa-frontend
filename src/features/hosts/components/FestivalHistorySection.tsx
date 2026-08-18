import type { HostFestivalHistoryItem } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  items: HostFestivalHistoryItem[];
  total: number;
};

/**
 * 응답이 미리보기 2건 + 전체 건수만 준다. 전체 목록은 축제 목록 화면(hostId 필터)의
 * 몫이라 여기선 페이지네이션도, 연도 필터도 만들지 않는다. 그 화면(#51)이 develop에
 * 아직 없어 "더 보기"는 링크가 아니라 건수 표시로만 둔다 (#46).
 */
export function FestivalHistorySection({ items, total }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">축제 이력</h2>
        <span className="text-caption-strong text-muted-soft">전체 {total}개</span>
      </div>

      {items.length ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.festivalId} className="flex flex-col">
              <div
                className={`relative aspect-[236/320] w-full overflow-hidden rounded-media ${gridTint(item.festivalId)}`}
              >
                <PosterImage
                  src={item.posterUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-3 truncate text-entity-name text-ink">{item.name}</h3>
              <span className="mt-1 text-label-regular text-muted-soft">
                {dateRange(item.startDate, item.endDate)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">등록된 축제 이력이 없습니다.</p>
      )}
    </section>
  );
}
