export type HostSummary = {
  id: number;
  name: string;
  logoUrl: string | null;
};

/** GET /festivals/upcoming — venueName이 있다 (히어로가 장소를 보여준다) */
export type UpcomingFestival = {
  festivalId: number;
  name: string;
  venueName: string;
  startDate: string;
  endDate: string;
  posterUrl: string | null;
  host: HostSummary;
};

/** GET /festivals/recent — venueName이 없다 (카드가 쓰지 않는다) */
export type RecentFestival = {
  festivalId: number;
  name: string;
  startDate: string;
  endDate: string;
  posterUrl: string | null;
  host: HostSummary;
};
