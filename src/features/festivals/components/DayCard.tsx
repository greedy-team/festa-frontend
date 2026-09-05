import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LineupDay } from "@/features/festivals/types";
import { dateWithWeekday } from "@/lib/festivalDate";
import { genreLabel } from "@/lib/artistGenre";
import { Badge } from "@/components/ui/Badge";

type Props = {
  day: LineupDay;
};

/** day-card (DESIGN.md) — 하루치 라인업 전체. 바텀시트는 없다 (#165, #168) */
export function DayCard({ day }: Props) {
  return (
    <div className="flex w-full flex-col rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <Badge variant="primary" className="min-w-[64px]">
          DAY {day.day}
        </Badge>
        {/* 날짜는 읽어야 하는 텍스트라 caption(14)·muted 아래로 내리지 않는다 (#165) */}
        <span className="text-caption text-muted">{dateWithWeekday(day.date)}</span>
      </div>

      {/* 아바타 자리를 두지 않고 이름만 세로로 쌓는다. 아티스트 실사진은 초상권
          때문에 쓰지 않고(DEC-0063), 그렇다고 빈 자리를 색 블록으로 채우지도
          않는다(DEC-0130) — 남는 것은 이름이고, 그 이름이 카드의 내용이다. */}
      {/* 전원을 나열한다. 실데이터가 하루 4~5팀이라 3명에서 끊고 바텀시트로 보내던
          두 층 구조가 할 일이 없었다(#168). 장르는 시트가 갖던 유일한 정보라 이름
          옆에 붙이고, 없으면 그리지 않는다.
          ponytail: 하루 열 팀을 넘는 축제가 들어오면 카드가 길어진다 — 그때는
          시트가 아니라 카드 안 접기로 간다. */}
      {/* 공개된 아티스트 행은 아티스트 상세로 가는 링크다. 행 전체 + chevron은
          ArtistRow·검색 결과 행과 같은 문법 — hover가 없는 모바일에서도 chevron이
          "눌린다"를 말해주고 터치 타깃이 행 폭 × 37px가 된다. 카드 패딩(p-5) 안쪽에서
          -mx-3/px-3으로 hover 배경만 텍스트보다 넓게 깐다. 공개 예정은 링크가 아니라
          chevron도 hover도 없다. */}
      <ul className="mt-3 flex flex-col gap-0.5">
        {day.artists.map((artist, i) => (
          <li key={artist.id ?? `secret-${i}`}>
            {artist.id !== null ? (
              <Link
                href={`/artists/${artist.id}`}
                className="-mx-3 flex items-center justify-between gap-2 rounded-md px-3 py-2 transition-colors hover:bg-surface-field"
              >
                <span className="truncate text-entity-name text-ink">
                  {artist.name}
                  {artist.genre ? (
                    <span className="ml-1.5 text-caption text-muted">
                      {genreLabel(artist.genre)}
                    </span>
                  ) : null}
                </span>
                <ChevronRight size={16} className="shrink-0 text-muted-soft" aria-hidden />
              </Link>
            ) : (
              <span className="-mx-3 flex px-3 py-2 text-entity-name text-muted-soft">
                공개 예정
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
