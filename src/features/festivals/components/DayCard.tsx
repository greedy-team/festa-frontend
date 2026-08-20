import type { LineupDay } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateWithWeekday } from "@/lib/festivalDate";
import { Badge } from "@/components/ui/Badge";
import { PosterImage } from "@/components/ui/PosterImage";

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

      {/* DESIGN.md day-card 스펙 — 64px 아바타 3개가 가로로 나란히, 이름은 그 아래 */}
      <div className="mt-4 flex gap-3">
        {visible.map((artist, i) => (
          <div
            key={artist.id ?? `secret-${i}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div
              className={`relative size-[64px] shrink-0 overflow-hidden rounded-pill ${
                artist.revealed ? gridTint(artist.id) : "bg-divider"
              }`}
            >
              {artist.revealed ? (
                <PosterImage
                  src={artist.imageUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>
            <span
              className={`w-full truncate text-center text-meta-medium ${
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
