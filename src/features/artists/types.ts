export type ArtistGenre = "HIPHOP" | "BALLAD_RNB" | "BAND" | "DANCE";

export type RecentAppearance = {
  festivalId: number;
  name: string;
  hostShortName: string;
};

/** GET /artists 목록 항목. imageUrl은 항상 null이다 (DEC-0063: 초상권 문제로 실제 사진 미사용) */
export type Artist = {
  artistId: number;
  name: string;
  imageUrl: string | null;
  genre: ArtistGenre | null;
  appearanceCount: number;
  recentFestival: RecentAppearance | null;
};

/** 명세서 1.2 공통 페이지네이션 응답 포맷 (page는 0-based) */
export type PaginatedArtists = {
  items: Artist[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ArtistSort = "APPEARANCES" | "NAME";

export type UpcomingShow = {
  festivalId: number;
  name: string;
  hostName: string;
  venueName: string;
  posterUrl: string | null;
  startDate: string;
  endDate: string;
  /** 서버가 계산한 값(숫자) — 축제 시작일이 아니라 이 아티스트의 공연일 기준이다 */
  dday: number;
  performanceDate: string;
  day: number;
};

export type Appearance = {
  festivalId: number;
  name: string;
  hostName: string;
  startDate: string;
  endDate: string;
};

/** GET /artists/{id}. imageUrl은 항상 null이라 읽지 않는다 (DEC-0063, #47) */
export type ArtistDetail = {
  id: number;
  name: string;
  otherNames: string[];
  genre: ArtistGenre | null;
  instagramUrl: string | null;
  upcomingShows: {
    items: UpcomingShow[];
    total: number;
  };
  appearances: {
    items: Appearance[];
    total: number;
  };
};
