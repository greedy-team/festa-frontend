import type { LineupDay } from "@/features/festivals/types";
import { dateWithWeekday } from "@/lib/festivalDate";
import { Badge } from "@/components/ui/Badge";

type Props = {
  day: LineupDay;
  onMore: () => void;
};

const VISIBLE_COUNT = 3;

/** day-card (DESIGN.md) — 하루치 라인업 미리보기. 전체는 LineupSheet에서 본다 */
export function DayCard({ day, onMore }: Props) {
  const visible = day.artists.slice(0, VISIBLE_COUNT);
  const hasMore = day.artists.length > VISIBLE_COUNT;

  return (
    <div className="flex w-full flex-col rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <Badge variant="primary" className="min-w-[64px]">
          DAY {day.day}
        </Badge>
        <span className="text-meta text-muted-soft">
          {dateWithWeekday(day.date)}
        </span>
      </div>

      {/* 아바타 자리를 두지 않고 이름만 세로로 쌓는다. 아티스트 실사진은 초상권
          때문에 쓰지 않고(DEC-0063), 그렇다고 빈 자리를 색 블록으로 채우지도
          않는다(DEC-0130) — 남는 것은 이름이고, 그 이름이 카드의 내용이다.
          DESIGN.md의 day-card 스펙(64px 아바타 3개)은 이 결정들보다 먼저 그려진
          것이라 따르지 않는다. */}
      <ul className="mt-4 flex flex-col gap-2">
        {visible.map((artist, i) => (
          <li
            key={artist.id ?? `secret-${i}`}
            className={`truncate text-caption-strong ${
              artist.id !== null ? "text-ink" : "text-muted-soft"
            }`}
          >
            {artist.id !== null ? artist.name : "공개 예정"}
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-3 w-fit cursor-pointer text-meta-medium text-primary"
        >
          + 더보기
        </button>
      ) : null}
    </div>
  );
}
