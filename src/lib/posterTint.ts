// DESIGN.md poster-tints — 이미지 대역 플레이스홀더다. 브랜드 색이 아니다.
const HERO_TINTS = ["bg-hero-1", "bg-hero-2", "bg-hero-3", "bg-hero-4"] as const;
const GRID_TINTS = [
  "bg-grid-1",
  "bg-grid-2",
  "bg-grid-3",
  "bg-grid-4",
  "bg-grid-5",
] as const;

/** 히어로 패널용 틴트 4종 중 하나 */
export function heroTint(id: number): string {
  return HERO_TINTS[Math.abs(id) % HERO_TINTS.length];
}

/** 그리드 카드용 틴트 5종 중 하나 */
export function gridTint(id: number): string {
  return GRID_TINTS[Math.abs(id) % GRID_TINTS.length];
}
