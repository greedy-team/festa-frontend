import { http, HttpResponse } from 'msw';
import { artistsDb, hostsDb } from '@/mocks/fixtures/db';
import { paginate, parsePageParams } from '@/mocks/fixtures/pagination';
import { Errors } from '@/mocks/fixtures/errors';
import { todayStr, daysUntil } from '@/mocks/fixtures/date';
import { findAppearances } from '@/mocks/fixtures/appearances';

const VALID_GENRE = ['HIPHOP', 'BALLAD_RNB', 'BAND', 'DANCE'];
const VALID_SORT = ['APPEARANCES', 'RECENT', 'NAME'];

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr/api';

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
        portraitUrl: artist.portraitUrl,
        genre: artist.genre,
        appearanceCount,
        recentFestival,
      })),
    });
  }),

  // 4.2 GET /artists/{id}
  http.get(`${API}/artists/:id`, ({ params, request }) => {
    const artist = artistsDb.find((a) => a.id === Number(params.id));
    if (!artist) return Errors.artistNotFound(new URL(request.url).pathname);

    const all = findAppearances(artist.id);
    const t = todayStr();

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
      portraitUrl: artist.portraitUrl,
      instagramUrl: artist.instagramUrl,
      upcomingShows: { items: upcoming.slice(0, 5).map(toUpcomingItem), total: upcoming.length },
      appearances: { items: past.slice(0, 5).map(toAppearanceItem), total: past.length },
    });
  }),
];
