"use client";

import { useEffect, useState } from "react";
import type { UpcomingFestival } from "@/features/home/types";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { HeroArrow } from "@/features/home/components/HeroArrow";
import { HeroDots } from "@/features/home/components/HeroDots";

// Tailwind 기본 브레이크포인트와 같은 값이어야 grid-cols-*와 어긋나지 않는다.
const SM = 640;
const LG = 1024;

function panelsForWidth(width: number): number {
  return width >= LG ? 4 : width >= SM ? 2 : 1;
}

type Props = {
  festivals: UpcomingFestival[];
};

export function Hero({ festivals }: Props) {
  const [panels, setPanels] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const update = () => setPanels(panelsForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 패널 수가 바뀌면 마지막 페이지를 넘어설 수 있다
  const pageCount = Math.max(1, Math.ceil(festivals.length / panels));
  const current = Math.min(page, pageCount - 1);
  const visible = festivals.slice(current * panels, current * panels + panels);

  if (festivals.length === 0) {
    return (
      <section className="flex h-[560px] items-center justify-center bg-canvas lg:h-[952px]">
        <p className="text-body text-muted">표시할 축제가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="relative h-[560px] w-full lg:h-[952px]">
      {/* 패널은 풀블리드다. 여백도 radius도 없이 맞닿는다 */}
      <div className="grid h-full w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((festival) => (
          <HeroPanel key={festival.festivalId} festival={festival} />
        ))}
      </div>

      {/* 화살표는 마진 32에 붙는다 — 콘텐츠가 아니라 히어로 위의 컨트롤이다 */}
      <div className="absolute inset-y-0 left-8 flex items-center">
        <HeroArrow
          direction="prev"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={current === 0}
        />
      </div>
      <div className="absolute inset-y-0 right-8 flex items-center">
        <HeroArrow
          direction="next"
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={current >= pageCount - 1}
        />
      </div>

      {pageCount > 1 ? (
        <div className="absolute inset-x-0 bottom-9 flex justify-center">
          <HeroDots count={pageCount} current={current} onSelect={setPage} />
        </div>
      ) : null}
    </section>
  );
}
