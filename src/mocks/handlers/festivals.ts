import { http, HttpResponse } from 'msw';
import { festivalsDb, hostsDb, artistsDb, type FestivalRecord } from '@/mocks/fixtures/db';
import { paginate, parsePageParams } from '@/mocks/fixtures/pagination';
import { Errors } from '@/mocks/fixtures/errors';
import { daysUntil, festivalStatus } from '@/mocks/fixtures/date';

const VALID_STATUS = ['UPCOMING', 'ONGOING', 'ENDED'];
const VALID_SORT = ['LATEST', 'UPCOMING', 'POPULAR']; // 최종 스펙 파라미터 표엔 없지만 호출 예시엔 등장 — 팀 컨펌 전까지 유지

// /api 접두사: 2026-08-23 백엔드 결정(DEC-0099), #127 참고.
const API = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr'}/api`;

function hostSummary(hostId: number) {
  const host = hostsDb.find((h) => h.id === hostId);
  if (!host) throw new Error(`fixture 오류: hostId=${hostId}에 해당하는 host 없음`);
  return { id: host.id, name: host.name, logoUrl: host.logoUrl };
}

function festivalListItem(f: FestivalRecord) {
  return {
    festivalId: f.id,
    name: f.name,
    host: hostSummary(f.hostId),
    posterUrl: f.posterUrl,
    startDate: f.startDate,
    endDate: f.endDate,
  };
}

export const festivalsHandlers = [
  // 3.1 GET /festivals
  http.get(`${API}/festivals`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const { page, size } = parsePageParams(url.searchParams);
    const hostId = url.searchParams.get('hostId');
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');
    const sort = url.searchParams.get('sort');
    const q = url.searchParams.get('q');
    const artistId = url.searchParams.get('artistId'); // 표엔 없지만 개요 본문에 사용법이 명시돼 있어 지원

    if (!Number.isInteger(page) || page < 0) return Errors.invalidPage(instance);
    if (!Number.isInteger(size) || size < 1 || size > 50) return Errors.invalidPageSize(instance);
    if (status && !VALID_STATUS.includes(status)) return Errors.festivalInvalidStatusType(instance);
    if (sort && !VALID_SORT.includes(sort)) return Errors.festivalInvalidSortType(instance);
    if (year && (!Number.isInteger(Number(year)) || Number(year) < 2000)) return Errors.festivalInvalidYear(instance);
    if (artistId && hostId) return Errors.festivalConflictingFilter(instance);
    if (hostId && !hostsDb.some((h) => h.id === Number(hostId))) return Errors.hostNotFound(instance);
    if (artistId && !artistsDb.some((a) => a.id === Number(artistId))) return Errors.artistNotFound(instance);

    let result = [...festivalsDb];

    if (hostId) result = result.filter((f) => f.hostId === Number(hostId));
    if (year) result = result.filter((f) => f.startDate.startsWith(year));
    if (q) result = result.filter((f) => f.name.includes(q));
    if (artistId) {
      const aid = Number(artistId);
      result = result.filter((f) => f.lineup.some((d) => d.artists.some((a) => a.artistId === aid)));
    }
    if (status) {
      result = result.filter((f) => festivalStatus(f.startDate, f.endDate) === status);
    }

    if (sort === 'UPCOMING') result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    else if (sort === 'LATEST') result.sort((a, b) => b.startDate.localeCompare(a.startDate));
    // POPULAR는 fixture에 인기 지표가 없어 필요해지면 추가 구현 (artists.ts의 RECENT와 동일한 제약)

    const paged = paginate(result, page, size);
    return HttpResponse.json({
      ...paged,
      items: paged.items.map(festivalListItem),
    });
  }),

  // 3.2 GET /festivals/upcoming
  http.get(`${API}/festivals/upcoming`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const limit = Number(url.searchParams.get('limit') ?? '10');
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) return Errors.festivalInvalidLimit(instance, 1, 50);

    const items = festivalsDb
      .filter((f) => festivalStatus(f.startDate, f.endDate) !== 'ENDED')
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit)
      .map((f) => ({
        festivalId: f.id,
        name: f.name,
        venueName: f.venueName,
        startDate: f.startDate,
        endDate: f.endDate,
        posterUrl: f.posterUrl,
        host: hostSummary(f.hostId),
      }));
    return HttpResponse.json({ items });
  }),

  // 3.3 GET /festivals/recent
  // 주의: 명세상 "등록 시각" 기준 정렬이지만 fixture엔 createdAt이 없어서 배열의 뒤쪽(최근 추가한 것)을
  // 최신으로 취급한다. 실제 등록순 검증이 필요한 테스트라면 db.ts에 createdAt을 추가해서 바꿀 것.
  // 상태 필터는 걸지 않는다 — "최근 등록된 축제"는 등록 시각 기준이지 진행 상태 기준이 아니고,
  // 과거 라인업 아카이브가 서비스 성격이라 종료된 축제가 최근 등록되는 경우도 있다.
  http.get(`${API}/festivals/recent`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const limit = Number(url.searchParams.get('limit') ?? '10');
    if (!Number.isInteger(limit) || limit < 1 || limit > 30) return Errors.festivalInvalidLimit(instance, 1, 30);

    const items = festivalsDb
      .slice()
      .reverse()
      .slice(0, limit)
      .map((f) => ({
        festivalId: f.id,
        name: f.name,
        startDate: f.startDate,
        endDate: f.endDate,
        posterUrl: f.posterUrl,
        host: hostSummary(f.hostId),
      }));
    return HttpResponse.json({ items });
  }),

  // 3.4 GET /festivals/{id}
  http.get(`${API}/festivals/:id`, ({ params, request }) => {
    const instance = new URL(request.url).pathname;
    if (!Number.isInteger(Number(params.id))) return Errors.invalidPathVariable(instance);
    const f = festivalsDb.find((x) => x.id === Number(params.id));
    if (!f) return Errors.festivalNotFound(instance);
    const host = hostsDb.find((h) => h.id === f.hostId)!;
    const dday = daysUntil(f.startDate);

    return HttpResponse.json({
      id: f.id,
      name: f.name,
      host: {
        id: host.id,
        name: host.name,
        logoUrl: host.logoUrl,
        instagramUrl: host.instagramUrl,
        homepageUrl: host.homepageUrl,
      },
      startDate: f.startDate,
      endDate: f.endDate,
      dday,
      posterUrl: f.posterUrl,
      lineup: f.lineup.map((day) => ({
        day: day.day,
        date: day.date,
        // order 필드는 없다 — DEC-0109: 배열 순서 자체가 계약이고, 순번 표기는 프론트가 인덱스로 만든다.
        artists: day.artists.map((a) => {
          if (!a.revealed) {
            return { id: null, name: null, imageUrl: null, genre: null, revealed: false };
          }
          const artist = artistsDb.find((ar) => ar.id === a.artistId)!;
          return {
            id: artist.id,
            name: artist.name,
            imageUrl: artist.imageUrl,
            genre: artist.genre,
            revealed: true,
          };
        }),
      })),
      admission: f.admission,
      location: {
        venueName: f.venueName,
        address: f.address,
        latitude: f.latitude,
        longitude: f.longitude,
      },
    });
  }),

  // 3.5 GET /festivals/{id}/summary
  http.get(`${API}/festivals/:id/summary`, ({ params, request }) => {
    const instance = new URL(request.url).pathname;
    if (!Number.isInteger(Number(params.id))) return Errors.invalidPathVariable(instance);
    const f = festivalsDb.find((x) => x.id === Number(params.id));
    if (!f) return Errors.festivalNotFound(instance);
    const host = hostsDb.find((h) => h.id === f.hostId)!;
    const dday = daysUntil(f.startDate);
    const flatLineup = f.lineup[0]?.artists ?? [];

    return HttpResponse.json({
      id: f.id,
      name: f.name,
      startDate: f.startDate,
      endDate: f.endDate,
      dday,
      host: { id: host.id, name: host.name, logoUrl: host.logoUrl },
      venueName: f.venueName,
      latitude: f.latitude,
      longitude: f.longitude,
      description: f.description,
      hashtags: f.hashtags,
      admission: {
        externalVisitor: f.admission.externalVisitor,
        ticketType: f.admission.ticketType,
        verification: f.admission.verification,
      },
      lineup: flatLineup.map((a) => {
        if (!a.revealed) return { id: null, name: null, imageUrl: null, revealed: false };
        const artist = artistsDb.find((ar) => ar.id === a.artistId)!;
        return { id: artist.id, name: artist.name, imageUrl: artist.imageUrl, revealed: true };
      }),
      lineupTotal: f.lineup.reduce((sum, d) => sum + d.artists.length, 0),
    });
  }),
];
