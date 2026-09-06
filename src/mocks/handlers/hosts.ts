import { http, HttpResponse } from 'msw';
import { hostsDb, festivalsDb, artistsDb } from '@/mocks/fixtures/db';
import { Errors } from '@/mocks/fixtures/errors';
import { todayStr, daysUntil } from '@/mocks/fixtures/date';
import { findAppearances } from '@/mocks/fixtures/appearances';

// /api 접두사: 2026-08-23 백엔드 결정(DEC-0099), #127 참고.
const API = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.every-festa.com'}/api`;

export const hostsHandlers = [
  // 5.1 GET /hosts/{id}
  http.get(`${API}/hosts/:id`, ({ params, request }) => {
    const instance = new URL(request.url).pathname;
    if (!Number.isInteger(Number(params.id))) return Errors.invalidPathVariable(instance);
    const host = hostsDb.find((h) => h.id === Number(params.id));
    if (!host) return Errors.hostNotFound(instance);

    const hostFestivals = festivalsDb.filter((f) => f.hostId === host.id);
    const t = todayStr();

    const upcomingFestivals = hostFestivals
      .filter((f) => f.endDate >= t)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((f) => ({
        festivalId: f.id,
        name: f.name,
        posterUrl: f.posterUrl,
        startDate: f.startDate,
        endDate: f.endDate,
        dday: daysUntil(f.startDate),
      }));

    const historyAll = hostFestivals
      .slice()
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map((f) => ({
        festivalId: f.id,
        name: f.name,
        posterUrl: f.posterUrl,
        startDate: f.startDate,
        endDate: f.endDate,
      }));

    // 자주 온 아티스트: 이 host의 축제 중 이미 종료된 라인업 등장 횟수만 집계
    // (/artists, /search와 동일하게 past-only 기준으로 맞춰서 appearanceCount가 endpoint마다 다르게 나오지 않게 함)
    const hostFestivalIds = new Set(hostFestivals.map((f) => f.id));
    const artistIds = new Set(
      hostFestivals
        .flatMap((f) => f.lineup.flatMap((day) => day.artists.map((a) => a.artistId)))
        .filter((id): id is number => id != null)
    );
    const appearanceCount = new Map<number, number>();
    for (const artistId of artistIds) {
      const count = findAppearances(artistId).filter(
        (row) => hostFestivalIds.has(row.festival.id) && row.festival.endDate < t
      ).length;
      if (count > 0) appearanceCount.set(artistId, count);
    }
    // 배열 순서가 곧 순위다 (DEC-0108) — 출연 횟수 내림차순, 동점은 artistId 오름차순
    const frequentArtists = [...appearanceCount.entries()]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 3)
      .map(([artistId, count]) => {
        const artist = artistsDb.find((a) => a.id === artistId)!;
        return { artistId: artist.id, name: artist.name, imageUrl: artist.imageUrl, appearanceCount: count };
      });

    return HttpResponse.json({
      id: host.id,
      name: host.name,
      shortName: host.shortName,
      region: host.region,
      logoUrl: host.logoUrl,
      bannerUrl: host.bannerUrl,
      homepageUrl: host.homepageUrl,
      availableYears: [...new Set(hostFestivals.map((f) => Number(f.startDate.slice(0, 4))))].sort((a, b) => b - a),
      upcomingFestivals,
      festivalHistory: { items: historyAll.slice(0, 2), total: historyAll.length },
      frequentArtists,
    });
  }),
];
