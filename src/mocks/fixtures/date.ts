/**
 * 축제 상태·D-day 계산의 단일 기준.
 *
 * festivals.ts/artists.ts/hosts.ts에 각자 `const today = () => new Date()`가 있었는데,
 * `new Date('2026-05-21')`(UTC 자정 파싱)과 `new Date()`(로컬 파싱)를 그대로 비교하면
 * KST 기준 매일 00~09시에 dday·상태 판정이 틀어졌다. 문자열(YYYY-MM-DD) 비교로 통일해서
 * 이 문제 자체를 없앤다.
 */

export const todayStr = () => new Date().toLocaleDateString('sv-SE'); // 로컬 'YYYY-MM-DD'

export function daysUntil(dateStr: string) {
  return Math.round((Date.parse(dateStr) - Date.parse(todayStr())) / 86_400_000);
}

export function festivalStatus(startDate: string, endDate: string): 'UPCOMING' | 'ONGOING' | 'ENDED' {
  const t = todayStr();
  if (startDate > t) return 'UPCOMING';
  if (endDate < t) return 'ENDED';
  return 'ONGOING';
}
