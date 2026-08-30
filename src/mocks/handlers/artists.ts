import { http, HttpResponse } from 'msw';
import { artistsDb, hostsDb } from '@/mocks/fixtures/db';
import { paginate, parsePageParams } from '@/mocks/fixtures/pagination';
import { Errors } from '@/mocks/fixtures/errors';
import { todayStr, daysUntil } from '@/mocks/fixtures/date';
import { findAppearances } from '@/mocks/fixtures/appearances';

const VALID_GENRE = ['HIPHOP', 'BALLAD_RNB', 'BAND', 'DANCE'];
const VALID_SORT = ['APPEARANCES', 'RECENT', 'NAME'];

// /api 접두사: 2026-08-23 백엔드 결정(DEC-0099), #127 참고.
const API = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr'}/api`;

export const artistsHandlers = [
  // 4.1 GET /artists
  http.get(`${API}/artists`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const { page, size } = parsePageParams(url.searchParams);
    const genre = url.searchParams.get('genre');
    const q = url.searchParams.get('q');
    const sort = url.searchParams.get('sort') ?? 'APPEARANCES';

    if (!Number.isInteger(page) || page < 0) return Errors.invalidPage(instance);
    if (!Number.isInteger(size) || size < 1 || size > 50) return Errors.invalidPageSize(instance);
    if (genre && !VALID_GENRE.includes(genre)) return Errors.artistInvalidGenreType(instance);
    if (!VALID_SORT.includes(sort)) return Errors.artistInvalidSortType(instance);

    let result = artistsDb.map((artist) => {
      const appearances = findAppearances(artist.id).filter((a) => a.festival.endDate < todayStr());
      const mostRecent = appearances.sort((a, b) => b.festival.endDate.localeCompare(a.festival.endDate))[0];
      const host = mostRecent ? hostsDb.find((h) => h.id === mostRecent.festival.hostId) : undefined;
      return {
        artist,
        appearanceCount: appearances.length,
        recentFestival: mostRecent && host
          ? { festivalId: mostRecent.festival.id, name: mostRecent.festival.name, hostShortName: host.shortName }
          : null,
      };
    });

    if (genre) result = result.filter((r) => r.artist.genre === genre);
    if (q) result = result.filter((r) => r.artist.name.includes(q) || r.artist.otherNames.some((n) => n.includes(q)));

    if (sort === 'NAME') result.sort((a, b) => a.artist.name.localeCompare(b.artist.name, 'ko'));
    else if (sort === 'APPEARANCES') result.sort((a, b) => b.appearanceCount - a.appearanceCount);
    // RECENT는 fixture에 등록/출연일 정밀 데이터가 부족해 필요해지면 추가 구현

    const paged = paginate(result, page, size);
    return HttpResponse.json({
      ...paged,
      items: paged.items.map(({ artist, appearanceCount, recentFestival }) => ({
        artistId: artist.id,
        name: artist.name,
        imageUrl: artist.imageUrl,
        genre: artist.genre,
        appearanceCount,
        recentFestival,
      })),
    });
  }),

  // 4.2 GET /artists/{id}
  http.get(`${API}/artists/:id`, ({ params, request }) => {
    const instance = new URL(request.url).pathname;
    if (!Number.isInteger(Number(params.id))) return Errors.invalidPathVariable(instance);
    const artist = artistsDb.find((a) => a.id === Number(params.id));
    if (!artist) return Errors.artistNotFound(instance);

    const all = findAppearances(artist.id);
    const t = todayStr();

    // 의도적으로 DOC-0007 문서 그대로가 아니다. 문서는 upcoming=performanceDate 기준,
    // past=festival.endDate 기준으로 서로 다른 필드를 쓰는데, 그렇게 하면 "축제는 진행 중인데
    // 이 아티스트 공연일만 지난" 경우가 upcoming도 past도 아니게 돼 출연 기록이 통째로
    // 사라진다(예: 3일짜리 축제 첫날 공연한 아티스트, 오늘이 둘째 날). 여기서는 upcoming/past
    // 둘 다 performanceDate 기준으로 배타적으로 나눠서 이 구멍을 없앴다.
    // 백엔드가 문서 그대로 구현했다면 실제 API도 같은 구멍을 가질 수 있다 — 백엔드 개발자
    // 검토 후 실제 동작이 다르다고 확인되면 이 필터를 그에 맞게 다시 바꿀 것.
    const upcoming = all
      .filter((a) => a.performanceDate >= t)
      .sort((a, b) => a.performanceDate.localeCompare(b.performanceDate));
    const past = all
      .filter((a) => a.performanceDate < t)
      .sort((a, b) => b.festival.startDate.localeCompare(a.festival.startDate));

    const toUpcomingItem = (row: (typeof all)[number]) => {
      const host = hostsDb.find((h) => h.id === row.festival.hostId)!;
      return {
        festivalId: row.festival.id,
        name: row.festival.name,
        hostName: host.name,
        venueName: row.festival.venueName,
        posterUrl: row.festival.posterUrl,
        startDate: row.festival.startDate,
        endDate: row.festival.endDate,
        dday: daysUntil(row.performanceDate),
        performanceDate: row.performanceDate,
        day: row.day,
      };
    };
    const toAppearanceItem = (row: (typeof all)[number]) => {
      const host = hostsDb.find((h) => h.id === row.festival.hostId)!;
      return {
        festivalId: row.festival.id,
        name: row.festival.name,
        hostName: host.name,
        startDate: row.festival.startDate,
        endDate: row.festival.endDate,
      };
    };

    return HttpResponse.json({
      id: artist.id,
      name: artist.name,
      otherNames: artist.otherNames,
      genre: artist.genre,
      imageUrl: artist.imageUrl,
      instagramUrl: artist.instagramUrl,
      upcomingShows: { items: upcoming.slice(0, 5).map(toUpcomingItem), total: upcoming.length },
      appearances: { items: past.slice(0, 5).map(toAppearanceItem), total: past.length },
    });
  }),
];
