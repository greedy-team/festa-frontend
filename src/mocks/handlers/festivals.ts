import { http, HttpResponse } from 'msw';
import { festivalsDb, hostsDb, artistsDb, type FestivalRecord } from '../fixtures/db';
import { paginate, parsePageParams } from '../fixtures/pagination';
import { Errors } from '../fixtures/errors';

const VALID_STATUS = ['UPCOMING', 'ONGOING', 'ENDED'];
const VALID_SORT = ['LATEST', 'UPCOMING', 'POPULAR']; // 최종 스펙 파라미터 표엔 없지만 호출 예시엔 등장 — 팀 컨펌 전까지 유지

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr/api';

const today = () => new Date(); // 실제 "오늘" 기준 status 계산. 테스트에서 날짜를 고정하려면 여기를 주입식으로 바꿀 것.

function hostSummary(hostId: number) {
  const host = hostsDb.find((h) => h.id === hostId);
  if (!host) throw new Error(`fixture 오류: hostId=${hostId}에 해당하는 host 없음`);
  return { id: host.id, name: host.name, type: host.type, logoUrl: host.logoUrl };
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

function festivalStatus(f: FestivalRecord): 'UPCOMING' | 'ONGOING' | 'ENDED' {
  const now = today();
  const start = new Date(f.startDate);
  const end = new Date(f.endDate);
  if (start > now) return 'UPCOMING';
  if (start <= now && end >= now) return 'ONGOING';
  return 'ENDED';
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

    if (page < 0) return Errors.invalidPage(instance);
    if (size < 1 || size > 50) return Errors.invalidPageSize(instance);
    if (status && !VALID_STATUS.includes(status)) return Errors.festivalInvalidStatusType(instance);
    if (sort && !VALID_SORT.includes(sort)) return Errors.festivalInvalidSortType(instance);
    if (year && Number(year) < 2000) return Errors.festivalInvalidYear(instance);
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
      // artistId + status 조합일 때는 일반 축제 status 판정과 다른 규칙(예정공연/출연이력)이 적용된다.
      // 지금은 라인업 소속 여부만 필터링하고, upcoming/ended 세부 판정은 필요해지면 artists.ts의
      // upcomingShows/appearances 로직과 맞춰 이 자리에 추가할 것.
    } else if (status) {
      result = result.filter((f) => festivalStatus(f) === status);
    }

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
    if (limit < 1 || limit > 50) return Errors.festivalInvalidLimit(instance, 1, 50);

    const items = festivalsDb
      .filter((f) => festivalStatus(f) !== 'ENDED')
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit)
      .map((f) => ({
        festivalId: f.id,
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
  http.get(`${API}/festivals/recent`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const limit = Number(url.searchParams.get('limit') ?? '10');
    if (limit < 1 || limit > 30) return Errors.festivalInvalidLimit(instance, 1, 30);

    const items = festivalsDb
      .filter((f) => festivalStatus(f) !== 'ENDED')
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
    const f = festivalsDb.find((x) => x.id === Number(params.id));
    if (!f) return Errors.festivalNotFound(new URL(request.url).pathname);
    const host = hostsDb.find((h) => h.id === f.hostId)!;
    const dday = Math.ceil((new Date(f.startDate).getTime() - today().getTime()) / 86_400_000);

    return HttpResponse.json({
      id: f.id,
      name: f.name,
      host: {
        id: host.id,
        type: host.type,
        name: host.name,
        logoUrl: host.logoUrl,
        instagramUrl: host.instagramUrl,
        homepageUrl: host.homepageUrl,
      },
      startDate: f.startDate,
      endDate: f.endDate,
      dday,
      images: f.images,
      lineup: f.lineup.map((day) => ({
        day: day.day,
        date: day.date,
        artists: day.artists.map((a) => {
          if (!a.revealed) {
            return { id: null, name: null, imageUrl: null, genre: null, order: a.order, revealed: false };
          }
          const artist = artistsDb.find((ar) => ar.id === a.artistId)!;
          return {
            id: artist.id,
            name: artist.name,
            imageUrl: artist.portraitUrl,
            genre: artist.genre,
            order: a.order,
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
        kakaoPlaceId: f.kakaoPlaceId,
        transits: [], // fixture 단순화: 필요해지면 db.ts에 transits 필드 추가
      },
      notices: {
        items: f.notices.slice(0, 4).map(({ id, type, title, publishedAt }) => ({ id, type, title, publishedAt })),
        total: f.notices.length,
      },
    });
  }),

  // 3.5 GET /festivals/{id}/summary
  http.get(`${API}/festivals/:id/summary`, ({ params, request }) => {
    const f = festivalsDb.find((x) => x.id === Number(params.id));
    if (!f) return Errors.festivalNotFound(new URL(request.url).pathname);
    const host = hostsDb.find((h) => h.id === f.hostId)!;
    const dday = Math.ceil((new Date(f.startDate).getTime() - today().getTime()) / 86_400_000);
    const flatLineup = f.lineup[0]?.artists ?? [];

    return HttpResponse.json({
      id: f.id,
      name: f.name,
      startDate: f.startDate,
      endDate: f.endDate,
      dday,
      host: { id: host.id, type: host.type, name: host.name, logoUrl: host.logoUrl },
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
        return { id: artist.id, name: artist.name, imageUrl: artist.portraitUrl, revealed: true };
      }),
      lineupTotal: f.lineup.reduce((sum, d) => sum + d.artists.length, 0),
    });
  }),

  // 3.6 GET /festivals/{id}/notices — 커서 기반. fixture는 전체를 한 페이지로 반환(hasNext:false)해서 단순화.
  // 참고: 에러 코드 카탈로그엔 이 엔드포인트가 FESTIVAL_NOT_FOUND 사용처 목록에 없음(문서 누락 추정) —
  // 그래도 축제 없이 공지를 조회하는 게 말이 안 되니 그대로 404 처리해둠. 문제되면 팀에 확인할 것.
  http.get(`${API}/festivals/:id/notices`, ({ params, request }) => {
    const f = festivalsDb.find((x) => x.id === Number(params.id));
    if (!f) return Errors.festivalNotFound(new URL(request.url).pathname);
    return HttpResponse.json({
      items: f.notices,
      total: f.notices.length,
      nextCursor: null,
      hasNext: false,
    });
  }),
];
