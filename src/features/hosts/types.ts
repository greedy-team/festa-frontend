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

/** 순위 필드는 두지 않는다 — 배열 순서가 곧 순위다 (DEC-0108) */
export type FrequentArtist = {
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
  /** 계약에는 있으나 화면에 그리지 않는다 — 값이 실제로 없고(DEC-0093) 빈 자리를
      색 블록으로 채우지 않는다(DEC-0130). 관리자 등록 화면의 입력 항목은 살아 있다 */
  logoUrl: string | null;
  bannerUrl: string | null;
  homepageUrl: string | null;
  availableYears: number[];
  upcomingFestivals: UpcomingHostFestival[];
  festivalHistory: {
    items: HostFestivalHistoryItem[];
    total: number;
  };
  frequentArtists: FrequentArtist[];
};
