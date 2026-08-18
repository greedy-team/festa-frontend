import type { Appearance } from "@/features/artists/types";
import { dateRange } from "@/lib/festivalDate";

type Props = {
  items: Appearance[];
  total: number;
};

/** 응답이 5건 + 전체 건수만 준다 (예정 공연과 같은 이유로 페이지네이션 없음, #47).
 * 시안엔 이 화면 전용의 이름·학교·날짜 3줄 행이 쓰였다 — DESIGN.md의 연도별로 여러 항목을
 * 묶는 past-lineup-row(연도 인디고 + 아티스트 나열)는 이 응답의 1건-1행 구조와 안 맞아
 * 재사용하지 않았다. 목적지가 정해지지 않아 링크는 걸지 않는다. */
export function AppearancesSection({ items, total }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">출연 이력</h2>
        <span className="text-caption-strong text-muted-soft">전체 {total}건</span>
      </div>

      {items.length ? (
        <div className="mt-4 flex flex-col gap-3">
          {items.map((appearance) => (
            <div
              key={appearance.festivalId}
              className="flex flex-col gap-1 rounded-row border border-border bg-surface px-6 py-4"
            >
              <span className="text-caption-strong text-primary">
                {appearance.startDate.slice(0, 4)}
              </span>
              <h3 className="text-entity-name text-ink">{appearance.name}</h3>
              <p className="text-label-regular text-muted">
                {appearance.hostName} ·{" "}
                {dateRange(appearance.startDate, appearance.endDate)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">출연 이력이 없습니다.</p>
      )}
    </section>
  );
}
