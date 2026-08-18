import type { LineupDay } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateWithWeekday } from "@/lib/festivalDate";

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
        <span className="rounded-pill bg-primary-soft px-3 py-1 text-meta-strong text-primary">
          DAY {day.day}
        </span>
        <span className="text-caption text-muted-soft">
          {dateWithWeekday(day.date)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {visible.map((artist, i) => (
          <div key={artist.id ?? `secret-${i}`} className="flex items-center gap-3">
            <div
              className={`size-[40px] shrink-0 rounded-pill ${
                artist.revealed ? gridTint(artist.id!) : "bg-divider"
              }`}
            />
            <span
              className={`truncate text-caption-strong ${
                artist.revealed ? "text-ink" : "text-muted-soft"
              }`}
            >
              {artist.revealed ? artist.name : "공개 예정"}
            </span>
          </div>
        ))}
      </div>

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
