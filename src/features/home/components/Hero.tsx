"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronDown } from "lucide-react";
import type { UpcomingFestival } from "@/features/home/types";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { HeroSurface } from "@/components/layout/HeroSurface";

// 아티스트를 못 불러왔을 때의 배경. 이 화면은 히어로 패널 네 장이 있어야 할 자리가 통째로
// 비어 있는 상태다 — 그래서 그 패널들이 쓰는 틴트를 그대로 크게 번지게 해서
// "포스터가 흐려진 자리"로 읽히게 한다. 브랜드 색으로 전용하는 게 아니라
// 이미지 대역 플레이스홀더라는 성격을 유지한 표현이다(DESIGN.md Poster Tints).
//
// mix-blend-screen인 이유: 틴트도 바탕(hero-1)도 어두워서 그냥 얹으면 서로
// 묻혀 거의 안 보인다. screen은 어두운 색끼리도 밝은 쪽으로 합성해서 색이
// 실제로 드러난다.
//
// duration을 셋 다 다르게 준 이유: 같으면 세 덩어리가 한 몸처럼 붙어 움직여서
// 배경 전체가 흔들리는 것처럼 보인다. delay는 음수라 첫 프레임부터 서로 다른
// 위상에서 시작한다(0에서 같이 출발하면 처음 몇 초가 겹친다).
const MESH_BLOBS = [
  {
    color: "var(--color-hero-2)",
    position: "-left-[20%] -top-[15%] size-[85vmax]",
    duration: "22s",
    delay: "0s",
  },
  {
    color: "var(--color-hero-4)",
    position: "-right-[25%] top-0 size-[75vmax]",
    duration: "18s",
    delay: "-7s",
  },
  {
    color: "var(--color-hero-3)",
    position: "-bottom-[30%] left-[15%] size-[80vmax]",
    duration: "26s",
    delay: "-13s",
  },
] as const;

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

// 이름 벽의 크기·불투명도 단계. 슬롯 폭과 같은 이유로 리터럴 표다 — 템플릿
// 문자열로 조합하면 Tailwind가 빌드 시점에 클래스를 못 찾는다.
//
// 불투명도가 DESIGN.md의 포스터 위 3단(100/85/75)을 따르지 않는 이유: 그 3단은
// "읽어야 하는 텍스트"의 위계이고, 이 이름들은 포스터가 있어야 할 자리를 대신
// 채우는 배경 텍스처다. 가운데 안내 문구와 경쟁하면 안 되므로 훨씬 아래에 둔다.
// 흰색 + 불투명도만 쓴다는 히어로 규칙은 그대로 지킨다.
//
// 5단인 이유: 4단이면 4열로 감기는 폭에서 같은 크기가 세로로 줄을 맞춰 표처럼
// 보인다. 열 수와 서로소인 길이라야 행마다 어긋난다.
const WALL_CLASS = [
  "text-hero-dday text-on-media/15",
  "text-hero-name text-on-media/10",
  "text-entity-name text-on-media/8",
  "text-hero-name text-on-media/15",
  "text-entity-name text-on-media/10",
] as const;

/**
 * 이름 벽에서 index번째 이름의 크기·불투명도.
 *
 * 어느 이름이 크게 보일지는 배열 위치로만 갈린다 — 화면 폭으로 갈리면
 * slideBasisClass와 같은 이유로 SSR과 하이드레이션이 어긋난다(LSN-0020).
 */
export function wallNameClass(index: number): string {
  return WALL_CLASS[Math.abs(index) % WALL_CLASS.length];
}

// 히어로가 이제 화면 높이를 꽉 채우므로, 아래에 더 볼 게 있다는 걸 알려주는
// 스크롤 힌트다. 누르면 바로 다음 섹션으로 내려간다. 바깥 래퍼가 inset-x-0라
// 전체 폭을 차지하는데, pointer-events-none을 안 주면 그 빈 영역이 밑에 깔린
// 패널 링크의 클릭을 가로챈다(#68에서 도트가 똑같은 이유로 겪은 문제).
function ScrollHint({ hidden = false }: { hidden?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <div
      ref={(node) => {
        sectionRef.current = node?.closest("section") ?? null;
      }}
      inert={hidden}
      aria-hidden={hidden}
      className={`pointer-events-none absolute inset-x-0 bottom-9 flex justify-center transition-opacity duration-150 motion-reduce:transition-none ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        onClick={() =>
          sectionRef.current?.nextElementSibling?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          })
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
  /**
   * 다가오는 축제가 0건일 때만 쓰는 아티스트 이름 벽 재료. 축제가 있으면
   * page.tsx가 부르지 않으므로 undefined다 — 못 불러온 것과 구분되지 않지만,
   * 두 경우 모두 배경을 메시로 되돌린다는 결론이 같아 나누지 않는다.
   * total은 가져온 개수가 아니라 전체 수다(LSN-0018).
   */
  artists?: { names: string[]; total: number };
};

export function Hero({ festivals, artists }: Props) {
  const hasCarousel = festivals.length > 1;
  const wallRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const wall = wallRef.current;
    const section = wall?.closest("section");
    if (!wall || !section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // 움직이는 배경이 아니라 고정된 섹션으로 재야 배율이 측정값에 되먹임되지 않는다.
      const { top, height } = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / (height * 0.6)));
      wall.style.setProperty("--wall-scale", String(1.06 - progress * 0.12));
      wall.style.setProperty("--wall-y", `${progress * 80}px`);
      wall.style.setProperty("--wall-opacity", String(1 - progress * 0.65));
      setScrolled(top < -8);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [festivals.length, artists]);

  // 다가오는 축제가 하나도 없는 시즌(방학 등)도 실제로 있다 — 빈 문구 대신
  // 실제 패널과 같은 톤(다크 틴트 + 흰 타이포)으로 왜 비어 있는지를 설명하고
  // 다음 행동 하나로 이어준다. 특정 축제 색이 아니라 서비스 자체를 나타내는
  // 자리라 hero-1을 고정으로 쓴다(축제 id 해시 대상이 없다).
  if (festivals.length === 0) {
    return (
      // pt-[72px]: 헤더가 위에 겹치므로 그만큼 내려서 가운데를 맞춘다
      // isolate: mix-blend-screen이 섞일 대상을 이 섹션 안으로 가둔다. 없으면
      // 합성 경계가 더 위(body)로 올라가 헤더 등 바깥 요소까지 끌어들인다
      <HeroSurface className="isolate flex flex-col items-center justify-center overflow-hidden bg-hero-1 px-6 pt-[72px] text-center">
        {artists ? (
          /* 아티스트 이름 벽. 포스터가 있어야 할 자리를 실제 데이터로 채운다 —
             빈자리를 색으로 덮지 않는다(DEC-0130). 화면이 "둘러볼 수 있어요"라고
             말하는 것의 근거이기도 하다.

             aria-hidden: 읽는 텍스트가 아니라 배경 텍스처다. 스크린리더가 이름
             50개를 안내 문구보다 먼저 읽으면 이 화면의 요지가 묻힌다.
             pointer-events-none: 전면을 덮으므로 없으면 가운데 CTA와 스크롤
             힌트의 클릭을 가로챈다(ISS-0070이 도트에서 겪은 것과 같은 자리). */
          <>
            {/* content-evenly: 50개로는 h-dvh를 못 채워서 content-center면 가운데
                덩어리로 뭉치고 위아래가 빈다. 줄 간격을 화면 높이에 맞춰 편다 */}
            <div
              ref={wallRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-wrap content-evenly justify-center gap-x-7 px-10 [overflow-anchor:none] motion-safe:scale-[var(--wall-scale,1.06)] motion-safe:translate-y-[var(--wall-y,0px)] motion-safe:opacity-[var(--wall-opacity,1)]"
            >
              {artists.names.map((name, i) => (
                <span key={i} className={`whitespace-nowrap ${wallNameClass(i)}`}>
                  {name}
                </span>
              ))}
            </div>

            {/* 가운데를 바탕색으로 눌러 안내 문구가 이름과 겹쳐도 읽히게 한다.
                포스터 위 스크림(순검정 55%)을 쓰지 않는 이유: 그건 화면 전체를
                덮어 벽까지 같이 죽인다. 여기서 필요한 건 가운데만 비우는 것이라
                바탕(hero-1)을 타원으로 얹는다 — 새 색을 만들지 않는다 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_44%_at_50%_50%,var(--color-hero-1)_0%,var(--color-hero-1)_38%,transparent_76%)]"
            />
          </>
        ) : (
          /* 감싸는 div 없이 형제로 편다 — 사이에 래퍼를 하나 끼우면 그게 합성
             경계가 돼서 blend가 바탕(hero-1)이 아니라 그 빈 래퍼와 섞인다.
             화면 밖으로 나가는 부분은 위의 overflow-hidden이 자른다 */
          MESH_BLOBS.map(({ color, position, duration, delay }) => (
            <div
              key={color}
              aria-hidden
              className={`pointer-events-none absolute animate-hero-drift mix-blend-screen motion-reduce:animate-none ${position}`}
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                animationDuration: duration,
                animationDelay: delay,
              }}
            />
          ))
        )}

        {/* max-w만 두지 않고 w-full을 같이 둔다 — 부모가 items-center인 flex 열
            이라 자식은 폭을 안 주면 내용 폭(max-content)으로 잡히고, 그러면 부모
            보다 넓어질 수 있다(coding-principles "폭을 고정하지 않는다" 항목).
            부모(HeroSurface)가 확정 폭이라 여기서 100%는 기준이 있다 */}
        <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center gap-5">
          <p className="animate-fade-up text-caption-strong text-on-media/75 motion-reduce:animate-none">
            {artists ? `아티스트 ${artists.total}팀` : "FESTA"}
          </p>
          <h1
            // break-keep(word-break: keep-all): 없으면 좁은 화면에서 "축제 사 /
            // 이의"처럼 어절 중간이 끊긴다. 한글은 어절 단위로 넘겨야 읽힌다
            className="animate-fade-up text-balance break-keep text-hero text-on-media motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            지금은 축제 사이의 계절이에요
          </h1>
          <p
            className="animate-fade-up text-pretty break-keep text-body text-on-media/85 motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            대학 축제는 보통 5월과 9월에 열려요. 그때까지 지난 축제와 아티스트를
            둘러볼 수 있어요.
          </p>
          {/* Button.tsx는 <button> 전용이고 변형도 전부 밝은 배경 기준이라 이
              자리에 쓸 수 없다. 한 번 쓰는 자리라 secondary-ink와 같은 값(흰
              채움 + ink, h48 r12)을 인라인으로 둔다. 포커스 링은 흰 버튼 위에
              흰 링이 안 보이므로 offset으로 어두운 바탕 쪽에 그린다 — 히어로에
              인디고를 넣지 않는다는 규칙(DESIGN.md) 때문에 기본 링을 못 쓴다 */}
          <Link
            href={artists ? "/artists" : "/festivals"}
            className="mt-3 inline-flex h-[48px] animate-fade-up items-center rounded-md bg-surface px-6 text-button text-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-media motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ animationDelay: "300ms" }}
          >
            {artists ? "아티스트 둘러보기 →" : "축제 둘러보기 →"}
          </Link>
        </div>

        <ScrollHint hidden={scrolled} />
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
