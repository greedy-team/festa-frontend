"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CalendarDays, ChevronDown, ChevronRight, Music2, Search } from "lucide-react";
import type { UpcomingFestival } from "@/features/home/types";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { HeroSurface } from "@/components/layout/HeroSurface";
import { PosterImage } from "@/components/ui/PosterImage";

// 다가오는 축제가 0건일 때(방학 등) 보여줄 바로가기 3개 — 실제 목적지 화면이
// 있는 라우트만 넣는다. 분실물은 아직 목적지 화면이 없어(LostPanel.tsx 주석
// 참고) 제외했다.
const QUICK_LINKS = [
  {
    href: "/festivals",
    icon: CalendarDays,
    title: "축제 라인업",
    desc: "다가오는 축제와 최근 등록된 축제를 확인하세요",
  },
  {
    href: "/artists",
    icon: Music2,
    title: "아티스트",
    desc: "출연 아티스트와 소속 정보를 찾아보세요",
  },
  {
    href: "/search",
    icon: Search,
    title: "통합 검색",
    desc: "축제·아티스트를 한 번에 검색하세요",
  },
] as const;

// 다가오는 축제가 0건일 때 히어로 배경. null이면 지금처럼 bg-hero-1 단색만
// 보인다. 사진을 쓰려면 파일을 `public/hero/offseason.jpg`로 저장하고 이 값을
// "/hero/offseason.jpg"로 바꾼다 — 사진이 배경으로 깔리고 흰 타이포 가독성을
// 위한 스크림이 얹힌다. 이미지 파일은 아직 없다 — 받아줄 자리만 만들어 둔
// 것이다(#150).
const EMPTY_HERO_BACKGROUND_SRC: string | null = null;

// 슬롯 수(1~4)별 폭을 리터럴 클래스로 미리 다 적어둔다 — 템플릿 문자열로
// 만들면 Tailwind가 빌드 시점에 클래스를 못 찾아서 스타일이 안 먹는다.
const BASIS_CLASS: Record<number, string> = {
  1: "basis-full",
  2: "basis-full sm:basis-1/2",
  3: "basis-full sm:basis-1/2 lg:basis-1/3",
  4: "basis-full sm:basis-1/2 lg:basis-1/4",
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
  const slots = Math.min(4, Math.max(1, count));
  return `shrink-0 ${BASIS_CLASS[slots]}`;
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

  // 다가오는 축제가 하나도 없는 시즌(방학 등)도 실제로 있다 — 빈 문구 대신
  // 실제 패널과 같은 톤(다크 틴트 + 흰 타이포)으로 서비스를 소개하고
  // 다른 콘텐츠로 이어준다. 특정 축제 색이 아니라 서비스 자체를 나타내는
  // 자리라 hero-1을 고정으로 쓴다(축제 id 해시 대상이 없다).
  if (festivals.length === 0) {
    return (
      // pt-[72px]: 헤더가 위에 겹치므로 그만큼 내려서 가운데를 맞춘다
      <HeroSurface className="flex flex-col items-center justify-center gap-10 overflow-hidden bg-hero-1 px-6 pt-[72px] text-center">
        {EMPTY_HERO_BACKGROUND_SRC ? (
          <>
            {/* 로드 실패 시 PosterImage만 사라진다 — 형제인 스크림은 남아
                bg-hero-1 위에 순검정 55%가 깔린 상태가 된다(글로우는 없음).
                흰 타이포 가독성에는 유리해 그대로 둔다 */}
            <PosterImage
              src={EMPTY_HERO_BACKGROUND_SRC}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            {/* 사진 위 흰 타이포 가독성 — 순검정 55% 단일 단계(DESIGN.md) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-scrim-hero"
            />
          </>
        ) : (
          /* 은은하게 떠다니는 글로우 — 축제가 없어도 화면이 멈춰 있지 않다는
             인상을 준다. prefers-reduced-motion이면 정지 상태로 남는다 */
          <div
            aria-hidden
            className="pointer-events-none absolute -left-1/4 top-1/4 size-[600px] rounded-pill bg-white/10 blur-3xl animate-hero-drift motion-reduce:animate-none"
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-4">
          <p className="animate-fade-up text-caption-strong text-on-media/75 motion-reduce:animate-none">
            FESTA
          </p>
          <h1
            className="max-w-[720px] animate-fade-up text-balance text-hero text-on-media motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            전국 대학 축제 라인업을 한눈에
          </h1>
          <p
            className="max-w-[480px] animate-fade-up text-body text-on-media/85 motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            다가오는 축제가 없는 지금, 이런 걸 먼저 둘러보세요.
          </p>
        </div>

        <div
          className="relative z-10 grid w-full max-w-[900px] animate-fade-up grid-cols-1 gap-4 text-left motion-reduce:animate-none sm:grid-cols-3"
          style={{ animationDelay: "300ms" }}
        >
          {QUICK_LINKS.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-card border border-white/20 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-[44px] items-center justify-center rounded-pill bg-white/20 text-on-media">
                <Icon size={20} aria-hidden />
              </span>
              <span className="text-subtitle text-on-media">{title}</span>
              <span className="text-caption-strong text-on-media/75">{desc}</span>
              <span className="mt-auto inline-flex items-center gap-1 text-caption-strong text-on-media/85">
                바로가기
                <ChevronRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>

        <ScrollHint />
      </HeroSurface>
    );
  }

  return (
    // 크기·헤더 겹침은 HeroSurface가 정한다 — 뷰포트 높이를 통째로 채우고 헤더 아래까지 올라간다.
    <HeroSurface>
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
    </HeroSurface>
  );
}
