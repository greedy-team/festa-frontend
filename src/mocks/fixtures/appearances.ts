import { festivalsDb } from './db';

/** performanceDate = festival.startDate + (lineup.day - 1) — 명세 1.5 날짜 계산 기준 그대로 */
export function performanceDate(startDate: string, day: number) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + (day - 1));
  return d.toISOString().slice(0, 10);
}

export function findAppearances(artistId: number) {
  const rows: { festival: (typeof festivalsDb)[number]; day: number; performanceDate: string }[] = [];
  for (const f of festivalsDb) {
    for (const dayEntry of f.lineup) {
      if (dayEntry.artists.some((a) => a.artistId === artistId && a.revealed)) {
        rows.push({ festival: f, day: dayEntry.day, performanceDate: performanceDate(f.startDate, dayEntry.day) });
      }
    }
  }
  return rows;
}
