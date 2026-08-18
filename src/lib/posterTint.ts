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

/** 문자열을 정수로 해시한다 (djb2 변형). 순수 함수라 같은 문자열은 항상 같은 값을 낸다. */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * 이름을 해시해서 그리드 틴트 팔레트에서 색을 고른다 — gridTint(id)와 같은 원리를
 * 문자열에 적용한 것 (#47: 아티스트 실사진 대신 이니셜 + 이름 해시 색상 아바타).
 */
export function nameTint(name: string): string {
  return GRID_TINTS[hashString(name) % GRID_TINTS.length];
}
