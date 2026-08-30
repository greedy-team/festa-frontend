"use client";

import { createContext, useContext } from "react";

/** 헤더 높이(px). Header의 `h-[72px]`, HeroSurface의 `-mt-[72px]`와 같은 값이다. */
export const HEADER_HEIGHT = 72;

type HeroVisibility = {
  /** 히어로가 헤더 띠(상단 72px) 아래에 깔려 있는가 — true면 헤더를 투명하게 그린다 */
  overHero: boolean;
  setOverHero: (overHero: boolean) => void;
};

// SiteChrome이 값을 들고, HeroSurface가 쓰고, Header가 읽는다.
// 참고: 헤더가 히어로를 querySelector로 찾아 관찰하면 안 된다 — 셸이 히어로보다 먼저
// 마운트되고(MockProvider는 자식을 늦게 그린다) 그 뒤로 다시 찾지 않는다.
export const HeroVisibilityContext = createContext<HeroVisibility>({
  overHero: false,
  setOverHero: () => {},
});

export function useHeroVisibility() {
  return useContext(HeroVisibilityContext);
}
