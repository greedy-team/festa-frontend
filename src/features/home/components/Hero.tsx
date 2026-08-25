"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronDown } from "lucide-react";
import type { UpcomingFestival } from "@/features/home/types";
import { HeroPanel } from "@/features/home/components/HeroPanel";

// lg 슬롯 수(2/3/4)를 리터럴 클래스로 미리 다 적어둔다 — 템플릿 문자열로 만들면
// Tailwind가 빌드 시점에 클래스를 못 찾아서 스타일이 안 먹는다.
const LG_BASIS: Record<number, string> = {
  2: "lg:basis-1/2",
  3: "lg:basis-1/3",
  4: "lg:basis-1/4",
};

/**
 * 패널이 몇 장 보일지는 뷰포트(JS로 잰 window 폭)가 아니라 데이터 개수와 CSS
 * 브레이크포인트만으로 정한다 — 서버는 화면 폭을 모르므로 JS로 패널 수를
 * 계산하면 SSR과 하이드레이션 결과가 어긋난다(LSN-0020). 데이터 개수는 서버도
 * 알고 있어서 그 부분만 반영하고, 화면 폭 대응은 순수 CSS 미디어 쿼리에 맡긴다.
 * 목표 슬롯: 모바일 1 / sm(640) 2 / lg(1024) 4 — 축제가 그보다 적으면 있는
 * 만큼만 채워서 빈 칸 없이 꽉 차게 한다.
 */
export function slideBasisClass(count: number): string {
  const lgSlots = Math.min(4, count);
  return `shrink-0 basis-full sm:basis-1/2 ${LG_BASIS[lgSlots] ?? "lg:basis-1/4"}`;
}

// 히어로가 이제 화면 높이를 꽉 채우므로, 아래에 더 볼 게 있다는 걸 알려주는
// 스크롤 힌트다. 누르면 바로 다음 섹션으로 내려간다. 바깥 래퍼가 inset-x-0라
// 전체 폭을 차지하는데, pointer-events-none을 안 주면 그 빈 영역이 밑에 깔린
// 패널 링크의 클릭을 가로챈다(#68에서 도트가 똑같은 이유로 겪은 문제).
function ScrollHint() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <div
      ref={(node) => {
        sectionRef.current = node?.closest("section") ?? null;
      }}
      className="pointer-events-none absolute inset-x-0 bottom-9 flex justify-center"
    >
      <button
        type="button"
        onClick={() =>
          sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label="아래로 스크롤"
        className="pointer-events-auto animate-bounce rounded-pill bg-surface p-2 text-ink motion-reduce:animate-none"
      >
        <ChevronDown size={20} aria-hidden />
      </button>
    </div>
  );
}

type Props = {
  festivals: UpcomingFestival[];
};

export function Hero({ festivals }: Props) {
  const hasCarousel = festivals.length > 1;

  // 옵션·플러그인 배열을 매 렌더 새로 만들면 리액트 래퍼가 "옵션이 바뀌었다"고
  // 보고 매번 재초기화한다 — 그러면 오토플레이 타이머가 한 번도 안 끝나고
  // 계속 리셋된다. useState 초기화 함수로 최초 1회만 만든다.
  const [emblaOptions] = useState(() => ({
    loop: hasCarousel,
    align: "start" as const,
    slidesToScroll: "auto" as const,
  }));
  const [emblaPlugins] = useState(() =>
    hasCarousel ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, emblaPlugins);

  useEffect(() => {
    emblaApi?.plugins().autoplay?.play();
  }, [emblaApi]);

  if (festivals.length === 0) {
    return (
      <section className="flex h-[calc(100vh-72px)] min-h-[420px] max-h-[952px] items-center justify-center bg-canvas">
        <p className="text-body text-muted">표시할 축제가 없습니다.</p>
      </section>
    );
  }

  return (
    // nav(72px)를 뺀 나머지 화면 높이를 그대로 채운다 — 화면 크기가 달라도
    // 첫 화면 아래 끝까지 히어로가 닿는다. 952px는 DESIGN.md 시안 높이를
    // 상한으로만 남긴 것이고, 그보다 큰 화면(초고해상도 모니터 등)에서
    // 무한정 늘어나지 않게 막는다.
    <section className="relative h-[calc(100vh-72px)] min-h-[420px] max-h-[952px] w-full">
      {/* 패널은 풀블리드다. 여백도 radius도 없이 맞닿는다 */}
      <div className="h-full w-full overflow-hidden" ref={hasCarousel ? emblaRef : undefined}>
        <div className="flex h-full">
          {festivals.map((festival) => (
            <div key={festival.festivalId} className={slideBasisClass(festivals.length)}>
              <HeroPanel festival={festival} />
            </div>
          ))}
        </div>
      </div>

      <ScrollHint />
    </section>
  );
}
