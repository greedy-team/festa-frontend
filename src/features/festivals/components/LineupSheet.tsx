"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { LineupDay } from "@/features/festivals/types";
import { gridTint } from "@/lib/posterTint";
import { dateWithWeekday } from "@/lib/festivalDate";

type Props = {
  lineup: LineupDay[];
  initialDay: number | "ALL";
  onClose: () => void;
};

/**
 * 전체 라인업 바텀시트 (DESIGN.md 08-3 시안, #45 확장 작업).
 * 헤드라이너 배지는 뺐다 — GET /festivals/{id} 응답에 그런 필드가 없어
 * 지어낼 수 없다. 백엔드 스펙이 생기면 추가한다.
 */
export function LineupSheet({ lineup, initialDay, onClose }: Props) {
  const [tab, setTab] = useState<number | "ALL">(initialDay);
  const totalCount = lineup.reduce(
    (sum, d) => sum + d.artists.filter((a) => a.revealed).length,
    0,
  );
  const days = tab === "ALL" ? lineup : lineup.filter((d) => d.day === tab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-[1280px] overflow-y-auto rounded-t-sheet bg-surface p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sheet-title text-ink">전체 라인업</h2>
            <p className="mt-1 text-caption-strong text-muted">총 {totalCount}팀</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="cursor-pointer text-muted"
          >
            <X size={24} aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("ALL")}
            className={`cursor-pointer rounded-pill px-4 py-2 text-caption-strong ${
              tab === "ALL" ? "bg-primary text-on-primary" : "bg-surface-field text-ink"
            }`}
          >
            전체
          </button>
          {lineup.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setTab(d.day)}
              className={`cursor-pointer rounded-pill px-4 py-2 text-caption-strong ${
                tab === d.day ? "bg-primary text-on-primary" : "bg-surface-field text-ink"
              }`}
            >
              DAY {d.day}
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
                    <span className="w-6 shrink-0 text-meta-medium text-muted-soft">
                      {artist.order}
                    </span>
                    <div
                      className={`size-[36px] shrink-0 rounded-pill ${
                        artist.revealed ? gridTint(artist.id!) : "bg-divider"
                      }`}
                    />
                    <span
                      className={`text-caption-strong ${
                        artist.revealed ? "text-ink" : "text-muted-soft"
                      }`}
                    >
                      {artist.revealed ? artist.name : "공개 예정"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
