import { http, HttpResponse } from 'msw';
import { festivalsDb, artistsDb, hostsDb } from '@/mocks/fixtures/db';
import { Errors } from '@/mocks/fixtures/errors';
import { findAppearances } from '@/mocks/fixtures/appearances';
import { todayStr } from '@/mocks/fixtures/date';

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr/api';
const VALID_TYPE = ['ALL', 'ARTIST', 'HOST', 'FESTIVAL'];

function toFestivalResult(f: (typeof festivalsDb)[number]) {
  const host = hostsDb.find((h) => h.id === f.hostId)!;
  return {
    festivalId: f.id,
    name: f.name,
    host: { id: host.id, name: host.name, logoUrl: host.logoUrl },
    startDate: f.startDate,
    endDate: f.endDate,
    posterUrl: f.posterUrl,
  };
}
function toArtistResult(a: (typeof artistsDb)[number]) {
  const appearances = findAppearances(a.id).filter((row) => row.festival.endDate < todayStr());
  const latest = appearances.slice().sort((x, y) => y.festival.endDate.localeCompare(x.festival.endDate))[0];
  return {
    artistId: a.id,
    name: a.name,
    avatarUrl: a.portraitUrl,
    appearanceCount: appearances.length,
    latestAppearanceDate: latest ? latest.festival.endDate : null,
  };
}
function toHostResult(h: (typeof hostsDb)[number]) {
  const hostFestivals = festivalsDb.filter((f) => f.hostId === h.id);
  const latest = hostFestivals.slice().sort((x, y) => y.startDate.localeCompare(x.startDate))[0];
  return {
    id: h.id,
    name: h.name,
    logoUrl: h.logoUrl,
    hostType: h.type,
    festivalCount: hostFestivals.length,
    latestFestivalYearMonth: latest ? latest.startDate.slice(0, 7) : null,
  };
}

function matches(name: string, otherNames: string[] | undefined, q: string) {
  const norm = q.trim();
  return name.includes(norm) || (otherNames ?? []).some((n) => n.includes(norm));
}

export const searchHandlers = [
  // 7.1 GET /search — type 파라미터로 응답의 다형성이 갈리는 게 핵심. ALL 이외에는 나머지 배열을 [] 로 채운다.
  http.get(`${API}/search`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const q = url.searchParams.get('q');
    const type = url.searchParams.get('type') ?? 'ALL';

    if (!q || q.trim().length < 1) return Errors.searchInvalidQuery(instance);
    if (!VALID_TYPE.includes(type)) return Errors.searchInvalidType(instance);

    const matchedFestivals = festivalsDb.filter((f) => matches(f.name, [], q));
    const matchedArtists = artistsDb.filter((a) => matches(a.name, a.otherNames, q));
    const matchedHosts = hostsDb.filter((h) => matches(h.name, [h.shortName], q));

    const counts = {
      all: matchedFestivals.length + matchedArtists.length + matchedHosts.length,
      festival: matchedFestivals.length,
      artist: matchedArtists.length,
      host: matchedHosts.length,
    };

    return HttpResponse.json({
      query: q,
      selectedType: type,
      counts,
      festivals: type === 'ALL' || type === 'FESTIVAL' ? matchedFestivals.map(toFestivalResult) : [],
      artists: type === 'ALL' || type === 'ARTIST' ? matchedArtists.map(toArtistResult) : [],
      hosts: type === 'ALL' || type === 'HOST' ? matchedHosts.map(toHostResult) : [],
      relatedKeywords: counts.all === 0 ? ['연세대 아카라카', '대학 축제', '싸이'] : [],
    });
  }),

  // 7.2 GET /search/autocomplete — primary는 host → artist → festival 순으로 첫 매치를 대표 결과로 채택(단순화).
  // 실제 검색엔진의 랭킹 로직까지 흉내내지는 않음 — UI가 primary.type 분기만 잘 타는지 확인하는 용도.
  http.get(`${API}/search/autocomplete`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const q = url.searchParams.get('q');
    const limit = Number(url.searchParams.get('limit') ?? '5');

    if (!q || q.trim().length < 1) return Errors.searchInvalidQuery(instance);
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) return Errors.searchInvalidLimit(instance);

    const host = hostsDb.find((h) => matches(h.name, [h.shortName], q));
    const artist = !host ? artistsDb.find((a) => matches(a.name, a.otherNames, q)) : undefined;
    const festival = !host && !artist ? festivalsDb.find((f) => matches(f.name, [], q)) : undefined;

    let primary: unknown = null;
    if (host) primary = { type: 'HOST', ...toHostResult(host) };
    else if (artist) primary = { type: 'ARTIST', ...toArtistResult(artist) };
    else if (festival) primary = { type: 'FESTIVAL', ...toFestivalResult(festival) };

    const relatedFestivals = festivalsDb.filter((f) => matches(f.name, [], q)).slice(0, limit).map(toFestivalResult);
    const relatedArtists = artistsDb.filter((a) => matches(a.name, a.otherNames, q)).slice(0, limit).map(toArtistResult);
    const relatedHosts = hostsDb.filter((h) => matches(h.name, [h.shortName], q)).slice(0, limit).map(toHostResult);

    return HttpResponse.json({
      query: q,
      primary,
      festivals: primary && (primary as { type: string }).type !== 'FESTIVAL' ? relatedFestivals : [],
      artists: primary && (primary as { type: string }).type !== 'ARTIST' ? relatedArtists : [],
      hosts: primary && (primary as { type: string }).type !== 'HOST' ? relatedHosts : [],
      relatedKeywords: primary ? [] : ['연세대 아카라카', '대학 축제', '싸이'],
    });
  }),
];
