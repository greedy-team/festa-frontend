"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { HEADER_HEIGHT, useHeroVisibility } from "./HeroVisibilityContext";

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * 헤더 아래까지 올라오는 첫 화면 면.
 *
 * 뷰포트 높이(dvh)를 통째로 채우고 -mt로 sticky 헤더(72px) 밑까지 당겨 올려서 헤더가
 * 그 위에 투명하게 겹친다 — 해상도와 무관하게 첫 화면이 곧 히어로다. 예전의
 * `calc(100vh-72px)` + 952/1100/1300 상한은 뷰포트가 그보다 커도 화면을 못 채워서
 * 뺐다 — dvh 자체가 상한이다. 덕분에 시안의 프레임 좌표(D-day y140 등)를 그대로 쓴다.
 *
 * 이 면의 하단이 헤더 하단을 지나면 헤더가 솔리드로, 다시 올라오면 투명으로(양방향).
 * rootMargin으로 루트를 헤더 아래 영역으로 줄여 두면 그 순간 isIntersecting이 뒤집힌다.
 */
export function HeroSurface({ className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { setOverHero } = useHeroVisibility();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setOverHero]);

  return (
    <section
      ref={ref}
      className={`relative -mt-[72px] h-dvh min-h-[420px] w-full ${className}`}
    >
      {children}
    </section>
  );
}
