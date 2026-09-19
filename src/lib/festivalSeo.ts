import type { Festival, FestivalDetail } from "@/features/festivals/types";
import { festivalYear } from "@/lib/festivalDate";
import { SITE_URL } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

type Named = { name: string; startDate: string; endDate: string; host: { name: string } };

/**
 * 사람들은 축제명이 아니라 "학교 이름 + 축제 + 라인업"으로 찾는다 (#259).
 * 축제명에 이미 학교명·연도가 들어 있으면 다시 붙이지 않는다 — "2026 한양대학교 가을 대동제"에
 * 또 붙이면 제목이 "한양대학교 2026 한양대학교 …"가 된다.
 */
export function festivalHeadingParts({ name, startDate, endDate, host }: Named) {
  const year = festivalYear(startDate, endDate);
  return {
    before: name.includes(host.name) ? null : host.name,
    name,
    // 해를 걸치는 축제("2025 ~ 2026")는 앞 연도만 들어 있어도 이미 연도를 말한 것으로 본다
    after: name.includes(year.slice(0, 4)) ? null : year,
  };
}

function fullName(festival: Named): string {
  const { before, name, after } = festivalHeadingParts(festival);
  return [before, name, after].filter(Boolean).join(" ");
}

export function festivalSeoTitle(festival: Named): string {
  return `${fullName(festival)} 라인업·일정·입장 안내`;
}

/** 학교 페이지는 해마다 주소가 같아 검색 신뢰가 쌓이는 자리다. 다가오는 축제가 있으면 그 연도를 담는다. */
export function hostSeoTitle(hostName: string, upcoming: { startDate: string; endDate: string }[]): string {
  const year = upcoming.length ? ` ${festivalYear(upcoming[0].startDate, upcoming[0].endDate)}` : "";
  return `${hostName} 축제${year} 라인업·일정`;
}

/** 연도를 고정값으로 적으면 해가 바뀔 때 조용히 낡는다. 서버가 UTC로 돌아도 한국 달력으로 센다. */
export function currentYearKst(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric" }).format(now);
}

export function siteTitle(now: Date = new Date()): string {
  return `${SITE_NAME} | ${currentYearKst(now)} 대학 축제 모음 · 일정·라인업`;
}

export function festivalListTitle(now: Date = new Date()): string {
  return `${currentYearKst(now)} 대학 축제 모음 · 일정·라인업`;
}

/** schema.org Festival(Event의 하위 타입). 값이 없는 항목은 빈 값으로 채우지 않고 뺀다. */
export function festivalEventJsonLd(festival: FestivalDetail) {
  const { location, admission, lineup, host } = festival;
  // DEC-0116: id가 null이면 시크릿 게스트다. 공개 전 출연자를 검색엔진에 먼저 넘기지 않는다.
  const performers = new Map<number, string>();
  for (const day of lineup) for (const artist of day.artists) if (artist.id !== null) performers.set(artist.id, artist.name);

  const hasGeo = location.latitude !== null && location.longitude !== null;
  const place = location.venueName || location.address ? {
    "@type": "Place",
    ...(location.venueName ? { name: location.venueName } : {}),
    ...(location.address ? { address: location.address } : {}),
    ...(hasGeo ? { geo: { "@type": "GeoCoordinates", latitude: location.latitude, longitude: location.longitude } } : {}),
  } : null;

  return {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: fullName(festival),
    startDate: festival.startDate,
    endDate: festival.endDate,
    url: `${SITE_URL}/festivals/${festival.id}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(festival.posterUrl ? { image: [festival.posterUrl] } : {}),
    ...(place ? { location: place } : {}),
    ...(admission.ticketType ? { isAccessibleForFree: admission.ticketType === "FREE" } : {}),
    organizer: { "@type": "CollegeOrUniversity", name: host.name, url: host.homepageUrl ?? `${SITE_URL}/hosts/${host.id}` },
    // MusicGroup의 정의는 솔로 뮤지션을 포함한다 — 그룹인지 개인인지 모르는 데이터에 맞는 타입이다
    ...(performers.size ? { performer: [...performers].map(([id, name]) => ({ "@type": "MusicGroup", name, url: `${SITE_URL}/artists/${id}` })) } : {}),
  };
}

export function festivalListJsonLd(items: Festival[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((festival, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: fullName(festival),
      url: `${SITE_URL}/festivals/${festival.festivalId}`,
    })),
  };
}

/**
 * 축제명·장소는 외부에서 들어온 값이다. script 안에 그대로 넣으면 "</script>"로 태그를 닫고
 * 나올 수 있어 "<"를 유니코드 이스케이프로 바꾼다. JSON으로는 같은 문자열이다.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
