import Link from "next/link";
import type { UpcomingShow } from "@/features/artists/types";
import { UpcomingShowCard } from "./UpcomingShowCard";

type Props = {
  artistId: number;
  items: UpcomingShow[];
  total: number;
};

/**
 * 응답이 5건 + 전체 건수만 준다. 전체 목록은 축제 목록 화면(artistId 필터)의 몫이라
 * 페이지네이션은 만들지 않는다.
 */
export function UpcomingShowsSection({ artistId, items, total }: Props) {
  const hasMore = total > items.length;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">예정 공연</h2>
        <span className="text-caption-strong text-muted-soft">전체 {total}건</span>
      </div>

      {items.length ? (
        // 가로 스크롤 카드 행 — 세로 목록보다 포스터가 커 보이고, "다음 걸 보러
        // 넘긴다"는 동작 자체가 미래형 콘텐츠(예정 공연)의 성격과 맞는다.
        // overflow-x-auto를 주면 브라우저가 overflow-y도 자동으로 클리핑 처리한다
        // (visible로 안 남는다) — 사방 패딩이 없으면 hover의 scale-105가 카드를
        // 중심에서 부풀릴 때 위쪽·좌우 끝이 이 경계에 잘린다. p-2로 여유를 준다.
        <div className="mt-4 flex gap-4 overflow-x-auto p-2 -m-2">
          {items.map((show) => (
            <UpcomingShowCard key={`${show.festivalId}-${show.day}`} show={show} />
          ))}
          {hasMore ? (
            <Link
              href={`/festivals?artistId=${artistId}`}
              className="flex aspect-[236/320] w-[200px] shrink-0 flex-col items-center justify-center rounded-media border border-border px-4 text-center text-caption-strong text-muted"
            >
              전체 예정 공연 보기 →
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">예정된 공연이 없습니다.</p>
      )}
    </section>
  );
}
