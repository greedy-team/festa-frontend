"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { LineupDay } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateWithWeekday } from "@/lib/festivalDate";
import { genreLabel } from "@/lib/artistGenre";
import { Chip } from "@/components/ui/Chip";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  lineup: LineupDay[];
  initialDay: number | "ALL";
  onClose: () => void;
};

/**
 * 전체 라인업 바텀시트 (DESIGN.md 08-3 시안, #45 확장 작업).
 * 헤드라이너 배지는 뺐다 — GET /festivals/{id} 응답에 그런 필드가 없어
 * 지어낼 수 없다. 백엔드 스펙이 생기면 추가한다.
 *
 * 네이티브 <dialog> + showModal()을 쓴다 — Esc·포커스 트랩·포커스 복귀·백드롭이
 * 전부 브라우저 몫이 된다 (SortDropdown의 네이티브 select와 같은 결).
 */
export function LineupSheet({ lineup, initialDay, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const totalCount = lineup.reduce((sum, d) => sum + d.artists.length, 0);
  const [tab, setTab] = useState<number | "ALL">(initialDay);
  const days = tab === "ALL" ? lineup : lineup.filter((d) => d.day === tab);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
      className="m-0 mb-0 w-full max-w-full border-0 bg-transparent p-0 backdrop:bg-black/40"
    >
      <div className="fixed inset-x-0 bottom-0 max-h-[80vh] w-full overflow-y-auto rounded-t-sheet bg-surface p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sheet-title text-ink">전체 라인업</h2>
            <p className="mt-1 text-caption-strong text-muted">총 {totalCount}팀</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="닫기"
            className="cursor-pointer text-muted"
          >
            <X size={24} aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => setTab("ALL")}>
            <Chip active={tab === "ALL"}>전체</Chip>
          </button>
          {lineup.map((d) => (
            <button key={d.day} type="button" onClick={() => setTab(d.day)}>
              <Chip active={tab === d.day}>DAY {d.day}</Chip>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {days.map((day) => (
            <div key={day.day}>
              <p className="text-caption-strong text-muted">
                DAY {day.day} · {dateWithWeekday(day.date)}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {day.artists.map((artist, i) => (
                  <li
                    key={artist.id ?? `secret-${i}`}
                    className="flex items-center gap-3 rounded-row border border-border px-4 py-3"
                  >
                    {/* DEC-0109: order 필드가 없다 — 배열 순서가 곧 계약이라 순번은 인덱스로 만든다 */}
                    <span className="w-6 shrink-0 text-meta-medium text-muted-soft">
                      {i + 1}
                    </span>
                    <div
                      className={`relative size-[36px] shrink-0 overflow-hidden rounded-pill ${
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
                      className={`flex-1 text-caption-strong ${
                        artist.revealed ? "text-ink" : "text-muted-soft"
                      }`}
                    >
                      {artist.revealed ? artist.name : "공개 예정"}
                    </span>
                    {/* 미공개 아티스트는 장르도 아직 안 보여준다 — 이름과 마찬가지로 자리만 유지.
                        장르가 없으면 칩 자리를 비워두지 않고 아예 그리지 않는다 (ArtistHero와 동일 관례) */}
                    {artist.revealed && artist.genre ? (
                      <span className="shrink-0 text-label-regular text-muted-soft">
                        {genreLabel(artist.genre)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}
