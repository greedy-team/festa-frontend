import Link from "next/link";
import type { Appearance } from "@/features/artists/types";
import { dateRange } from "@/lib/festivalDate";

type Props = {
  artistId: number;
  items: Appearance[];
  total: number;
};

/**
 * 응답이 5건 + 전체 건수만 준다. 전체 목록은 축제 목록 화면(artistId 필터)의 몫이다.
 * DESIGN.md의 여러 항목을 한 연도 아래 묶는 past-lineup-row(연도 인디고 + 아티스트
 * 나열)는 이 응답의 1건-1행 구조와 안 맞아 재사용하지 않는다.
 *
 * 대신 세로 타임라인으로 그린다 — 출연 이력은 실제로 시간순 기록이라, 숫자
 * 마커와 달리 "지나온 시간"이라는 정보를 구조 자체가 담을 자격이 있다
 * (예정 공연의 포스터 카드 행과 대비되는, 과거·기록형 콘텐츠의 결).
 */
export function AppearancesSection({ artistId, items, total }: Props) {
  const hasMore = total > items.length;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">출연 이력</h2>
        <span className="text-caption-strong text-muted">전체 {total}건</span>
      </div>

      {items.length ? (
        <div className="relative mt-6 flex flex-col gap-7">
          <div className="absolute bottom-1 left-[3px] top-1 w-px bg-divider" aria-hidden />
          {items.map((appearance) => (
            <div key={appearance.festivalId} className="relative pl-6">
              <span
                className="absolute left-[3px] top-1.5 size-[7px] -translate-x-1/2 rounded-pill bg-primary ring-4 ring-surface"
                aria-hidden
              />
              <p className="text-caption text-muted">
                {appearance.startDate.slice(0, 4)}
              </p>
              <h3 className="mt-0.5 text-entity-name text-ink">{appearance.name}</h3>
              {/* 학교·기간을 각각 한 줄씩 두면 둘 다 같은 옅은 회색이라 구분 없이
                  늘어져 보인다 — 같은 성격(부가 정보)이니 한 줄로 묶는다 */}
              <p className="mt-0.5 text-caption text-muted">
                {appearance.hostName} · {dateRange(appearance.startDate, appearance.endDate)}
              </p>
            </div>
          ))}
          {hasMore ? (
            <Link
              href={`/festivals?artistId=${artistId}`}
              className="ml-6 flex h-[44px] items-center justify-center rounded-md border border-border text-caption-strong text-muted"
            >
              더 많은 출연 이력 →
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">출연 이력이 없습니다.</p>
      )}
    </section>
  );
}
