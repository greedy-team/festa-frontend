"use client";

import { useState } from "react";
import type { UpcomingHostFestival } from "@/features/hosts/types";
import { HeroArrow } from "@/components/ui/HeroArrow";
import { HeroDots } from "@/components/ui/HeroDots";
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
  // 같은 라우트 패턴(/hosts/[id]) 사이를 클라이언트 이동하면 컴포넌트가 재마운트되지
  // 않아 index가 이전 host의 festivals.length 기준으로 남을 수 있다 — 항상 클램프한다.
  const current = Math.min(index, festivals.length - 1);
  const hasMultiple = festivals.length > 1;

  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-block-title text-ink">다가오는 축제</h2>
        {hasMultiple ? (
          <span className="text-caption text-muted-soft">
            {current + 1}/{festivals.length}
          </span>
        ) : null}
      </div>

      {festivals.length ? (
        <div className="mt-4 w-[356px] max-w-full">
          <div className="relative">
            <UpcomingFestivalCard festival={festivals[current]} />

            {hasMultiple ? (
              <>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <HeroArrow
                    direction="prev"
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    disabled={current === 0}
                  />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <HeroArrow
                    direction="next"
                    onClick={() =>
                      setIndex((i) => Math.min(festivals.length - 1, i + 1))
                    }
                    disabled={current >= festivals.length - 1}
                  />
                </div>
              </>
            ) : null}
          </div>

          {hasMultiple ? (
            <div className="mt-3 flex justify-center">
              <HeroDots
                count={festivals.length}
                current={current}
                onSelect={setIndex}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">예정된 축제가 없습니다.</p>
      )}
    </section>
  );
}
