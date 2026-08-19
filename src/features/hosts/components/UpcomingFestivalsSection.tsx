"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UpcomingHostFestival } from "@/features/hosts/types";
import { UpcomingFestivalCard } from "./UpcomingFestivalCard";

type Props = {
  festivals: UpcomingHostFestival[];
};

/**
 * 시안(10-3)은 카드 하나씩 넘기는 캐러셀이다. 대학 축제는 봄·가을에 몰려 있어
 * 0건인 시기가 더 흔하다 — 빈 상태 문구를 두고 섹션 자체는 감추지 않는다 (#46).
 * 1건이면 화살표·점 없이 카드 하나만 보여준다.
 */
export function UpcomingFestivalsSection({ festivals }: Props) {
  const [index, setIndex] = useState(0);
  const hasMultiple = festivals.length > 1;

  const prev = () => setIndex((i) => (i - 1 + festivals.length) % festivals.length);
  const next = () => setIndex((i) => (i + 1) % festivals.length);

  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-block-title text-ink">다가오는 축제</h2>
        {hasMultiple ? (
          <span className="text-caption text-muted-soft">
            {index + 1}/{festivals.length}
          </span>
        ) : null}
      </div>

      {festivals.length ? (
        <div className="relative mt-4 w-fit">
          <UpcomingFestivalCard festival={festivals[index]} />

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="이전 축제"
                className="absolute left-4 top-1/2 flex size-[40px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill bg-surface text-ink shadow-card"
              >
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="다음 축제"
                className="absolute right-4 top-1/2 flex size-[40px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill bg-surface text-ink shadow-card"
              >
                <ChevronRight size={20} aria-hidden />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2">
                {festivals.map((festival, i) => (
                  <button
                    key={festival.festivalId}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}번째 축제 보기`}
                    className={`size-[8px] cursor-pointer rounded-pill ${
                      i === index ? "bg-ink" : "bg-border-strong"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">예정된 축제가 없습니다.</p>
      )}
    </section>
  );
}
