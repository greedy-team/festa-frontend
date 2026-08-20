export type UpcomingHostFestival = {
  festivalId: number;
  name: string;
  posterUrl: string | null;
  startDate: string;
  endDate: string;
  /** 서버가 계산한 값(숫자) — 다시 계산하지 않고 포맷만 한다 */
  dday: number;
};

export type HostFestivalHistoryItem = {
  festivalId: number;
  name: string;
  posterUrl: string | null;
  startDate: string;
  endDate: string;
};

export type FrequentArtist = {
  rank: number;
  artistId: number;
  name: string;
  imageUrl: string | null;
  appearanceCount: number;
};

/** GET /hosts/{id}. host.type은 화면에 쓰지 않는다 (확정된 ERD에 없는 필드, #46) */
export type HostDetail = {
  id: number;
  name: string;
  shortName: string;
  region: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  availableYears: number[];
  upcomingFestivals: UpcomingHostFestival[];
  festivalHistory: {
    items: HostFestivalHistoryItem[];
    total: number;
  };
  frequentArtists: FrequentArtist[];
};
