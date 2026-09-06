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
        <span className="text-caption-strong text-muted">전체 {total}건</span>
      </div>

      {items.length ? (
        // 가로 스크롤 카드 행 — 세로 목록보다 포스터가 커 보이고, "다음 걸 보러
        // 넘긴다"는 동작 자체가 미래형 콘텐츠(예정 공연)의 성격과 맞는다.
        // overflow-x-auto를 주면 브라우저가 overflow-y도 자동으로 클리핑 처리한다
        // (visible로 안 남는다) — 사방 패딩이 없으면 hover의 scale-105·그림자
        // (elevation.hover)가 이 경계에 잘린다. 여유 폭을 결정하는 건 scale보다
        // 그림자다 — --shadow-hover(0 12px 40px, globals.css)의 위쪽 필요분(blur
        // 20px − y오프셋 12px = 8px) + 확대분(~7px)이 약 15px, 좌우는 확대분(~5px)
        // + 그림자(~20px)가 약 25px이라 p-6(24px)으로 넉넉히 잡았다 —
        // -m-6로 바깥 여백은 원래대로 되돌린다.
        //
        // mt-0을 명시한다 — mt-4를 쓰면 Tailwind가 .m-*를 .mt-*보다 먼저 출력해
        // (클래스 작성 순서와 무관) mt-4가 -m-6의 위쪽 상쇄를 덮어써서 제목과 카드
        // 사이 간격만 24px(padding-top)+16px(mt-4)=40px로 벌어진다. mt-0으로
        // margin-top을 0에 고정하면 padding-top(24px) 하나로만 간격이 정해져
        // 원래 의도한 24px이 유지된다.
        <div className="mt-0 flex gap-4 overflow-x-auto p-6 -m-6">
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
