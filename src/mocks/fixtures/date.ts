/**
 * 축제 상태·D-day 계산의 단일 기준.
 *
 * festivals.ts/artists.ts/hosts.ts에 각자 `const today = () => new Date()`가 있었는데,
 * `new Date('2026-05-21')`(UTC 자정 파싱)과 `new Date()`(로컬 파싱)를 그대로 비교하면
 * KST 기준 매일 00~09시에 dday·상태 판정이 틀어졌다. 문자열(YYYY-MM-DD) 비교로 통일해서
 * 이 문제 자체를 없앤다.
 */

export const todayStr = () => new Date().toLocaleDateString('sv-SE'); // 로컬 'YYYY-MM-DD'

/**
 * 오늘로부터 n일 뒤(음수면 앞)의 'YYYY-MM-DD'.
 *
 * 목 데이터의 날짜는 대부분 고정 문자열이라 시간이 지나면 "미래"였던 축제가 과거가 된다.
 * 실제로 예정 공연 E2E가 그 때문에 검증 대상을 못 찾고 스킵되고 있었다(#174).
 * "항상 예정이어야 하는" 자리에만 이걸 쓴다 — 나머지는 고정값이 대조하기 편하다.
 */
export const daysFromToday = (n: number) =>
  new Date(Date.parse(todayStr()) + n * 86_400_000).toLocaleDateString('sv-SE');

export function daysUntil(dateStr: string) {
  return Math.round((Date.parse(dateStr) - Date.parse(todayStr())) / 86_400_000);
}

export function festivalStatus(startDate: string, endDate: string): 'UPCOMING' | 'ONGOING' | 'ENDED' {
  const t = todayStr();
  if (startDate > t) return 'UPCOMING';
  if (endDate < t) return 'ENDED';
  return 'ONGOING';
}
