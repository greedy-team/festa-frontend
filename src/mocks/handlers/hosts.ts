import { http, HttpResponse } from 'msw';
import { hostsDb, festivalsDb, artistsDb } from '../fixtures/db';
import { Errors } from '../fixtures/errors';

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr/api';
const today = () => new Date();

export const hostsHandlers = [
  // 5.1 GET /hosts/{id}
  http.get(`${API}/hosts/:id`, ({ params, request }) => {
    const host = hostsDb.find((h) => h.id === Number(params.id));
    if (!host) return Errors.hostNotFound(new URL(request.url).pathname);

    const hostFestivals = festivalsDb.filter((f) => f.hostId === host.id);
    const now = today();

    const upcomingFestivals = hostFestivals
      .filter((f) => new Date(f.endDate) >= now)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((f) => ({
        festivalId: f.id,
        name: f.name,
        posterUrl: f.posterUrl,
        startDate: f.startDate,
        endDate: f.endDate,
        dday: Math.ceil((new Date(f.startDate).getTime() - now.getTime()) / 86_400_000),
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

    // 자주 온 아티스트: 이 host의 축제 라인업에 등장한 횟수를 집계
    const appearanceCount = new Map<number, number>();
    for (const f of hostFestivals) {
      for (const day of f.lineup) {
        for (const a of day.artists) {
          if (a.artistId != null) appearanceCount.set(a.artistId, (appearanceCount.get(a.artistId) ?? 0) + 1);
        }
      }
    }
    const frequentArtists = [...appearanceCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([artistId, count], i) => {
        const artist = artistsDb.find((a) => a.id === artistId)!;
        return { rank: i + 1, artistId: artist.id, name: artist.name, photoUrl: artist.portraitUrl, appearanceCount: count };
      });

    return HttpResponse.json({
      id: host.id,
      type: host.type, // 부록 변경사항엔 제거 예정이라고 되어 있으나, 필드표/응답 예시엔 남아있어 현재는 포함. 팀 컨펌 나오면 이 줄만 지우면 됨.
      name: host.name,
      shortName: host.shortName,
      subName: null, // 명세: name/subName 통합 예정 — 통합 전까지는 null로 유지
      region: host.region,
      logoUrl: host.logoUrl,
      bannerUrl: host.bannerUrl,
      availableYears: [...new Set(hostFestivals.map((f) => Number(f.startDate.slice(0, 4))))].sort((a, b) => b - a),
      upcomingFestivals,
      festivalHistory: { items: historyAll.slice(0, 2), total: historyAll.length },
      frequentArtists,
    });
  }),
];
