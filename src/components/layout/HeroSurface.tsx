"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { HEADER_HEIGHT, useHeroVisibility } from "./HeroVisibilityContext";

// 서버에는 useLayoutEffect가 없다(경고를 낸다). 브라우저에서만 레이아웃 단계로 올린다.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  // 스크롤된 상태로 새로고침하면(브라우저 스크롤 복원) 이 면이 이미 헤더 위로
  // 지나가 있는데, 컨텍스트 초기값은 경로만 보고 투명으로 잡는다. 옵저버는
  // 첫 페인트 뒤에야 보정하므로 그 사이 흰 본문 위에 흰 글자 헤더가 스친다.
  // 페인트 전(layout 단계)에 실제 위치로 한 번 맞춰 둔다.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverHero(el.getBoundingClientRect().bottom > HEADER_HEIGHT);
  }, [setOverHero]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      // 언마운트(다른 페이지로 이동 등) 직전에 옵저버 콜백이 한 번 더 늦게
      // 걸려 overHero를 true로 되돌리는 경우가 있다 — 그러면 이 히어로가
      // 사라진 뒤에도 헤더가 계속 투명한 채로 고정된다. 사라질 때는
      // 무조건 false로 확정한다.
      setOverHero(false);
    };
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
