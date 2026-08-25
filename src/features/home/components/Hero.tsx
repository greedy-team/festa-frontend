"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { UpcomingFestival } from "@/features/home/types";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { HeroArrow } from "@/components/ui/HeroArrow";
import { HeroDots } from "@/components/ui/HeroDots";

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
function slideBasisClass(count: number): string {
  const lgSlots = Math.min(4, count);
  return `shrink-0 basis-full sm:basis-1/2 ${LG_BASIS[lgSlots] ?? "lg:basis-1/4"}`;
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

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // emblaApi가 non-null이 되는 시점엔 embla의 init 이벤트가 이미 지나가 있어서,
    // "init" 리스너로는 첫 스냅 목록을 못 받는다 — 최초 1회는 동기 호출이 유일한 방법이다
    // (embla-carousel-react 공식 예제와 동일한 패턴).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.plugins().autoplay?.play();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

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
      <div className="h-full w-full overflow-hidden" ref={hasCarousel ? emblaRef : undefined}>
        <div className="flex h-full">
          {festivals.map((festival) => (
            <div key={festival.festivalId} className={slideBasisClass(festivals.length)}>
              <HeroPanel festival={festival} />
            </div>
          ))}
        </div>
      </div>

      {hasCarousel ? (
        <>
          {/* 화살표는 마진 32에 붙는다 — 콘텐츠가 아니라 히어로 위의 컨트롤이다 */}
          <div className="absolute inset-y-0 left-8 flex items-center">
            <HeroArrow direction="prev" onClick={scrollPrev} />
          </div>
          <div className="absolute inset-y-0 right-8 flex items-center">
            <HeroArrow direction="next" onClick={scrollNext} />
          </div>

          {scrollSnaps.length > 1 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-9 flex justify-center">
              <HeroDots count={scrollSnaps.length} current={selectedIndex} onSelect={scrollTo} />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
