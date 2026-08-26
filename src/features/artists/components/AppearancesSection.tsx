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
 * 시안엔 이 화면 전용의 연도·이름·학교·날짜 행이 쓰였다 — DESIGN.md의 여러 항목을
 * 한 연도 아래 묶는 past-lineup-row(연도 인디고 + 아티스트 나열)는 이 응답의
 * 1건-1행 구조와 안 맞아 재사용하지 않았다. 행마다 연도를 따로 보여준다.
 */
export function AppearancesSection({ artistId, items, total }: Props) {
  const hasMore = total > items.length;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">출연 이력</h2>
        <span className="text-caption-strong text-muted-soft">전체 {total}건</span>
      </div>

      {items.length ? (
        // 시안(09-2)은 테두리 없는 목록이다 — 연도 → 축제명 → 학교 → 기간을 한 행에 쌓는다.
        <div className="mt-4 flex flex-col gap-4">
          {items.map((appearance) => (
            <div key={appearance.festivalId}>
              <p className="text-label-regular text-muted-soft">
                {appearance.startDate.slice(0, 4)}
              </p>
              <h3 className="text-entity-name text-ink">{appearance.name}</h3>
              {/* 학교·기간을 각각 한 줄씩 두면 둘 다 같은 옅은 회색이라 구분 없이
                  늘어져 보인다 — 같은 성격(부가 정보)이니 한 줄로 묶는다 */}
              <p className="mt-0.5 text-label-regular text-muted">
                {appearance.hostName} · {dateRange(appearance.startDate, appearance.endDate)}
              </p>
            </div>
          ))}
          {hasMore ? (
            <Link
              href={`/festivals?artistId=${artistId}`}
              className="mt-1 flex h-[44px] items-center justify-center rounded-md border border-border text-caption-strong text-muted"
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
