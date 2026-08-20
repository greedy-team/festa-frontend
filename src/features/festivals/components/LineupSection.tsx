"use client";

import { useState } from "react";
import type { LineupDay } from "@/features/festivals/types";
import { DayCard } from "./DayCard";
import { LineupSheet } from "./LineupSheet";

type Props = {
  lineup: LineupDay[];
};

export function LineupSection({ lineup }: Props) {
  const [openDay, setOpenDay] = useState<number | "ALL" | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">라인업</h2>
        {lineup.length ? (
          <button
            type="button"
            onClick={() => setOpenDay("ALL")}
            className="cursor-pointer text-caption-strong text-muted"
          >
            전체 라인업 보기 →
          </button>
        ) : null}
      </div>

      {lineup.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {lineup.map((day) => (
            <DayCard key={day.day} day={day} onMore={() => setOpenDay(day.day)} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">라인업이 아직 공개되지 않았습니다.</p>
      )}

      {openDay !== null ? (
        <LineupSheet
          lineup={lineup}
          initialDay={openDay}
          onClose={() => setOpenDay(null)}
        />
      ) : null}
    </section>
  );
}
