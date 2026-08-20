import type { HostSummary } from "@/features/home/types";
import type { ArtistGenre } from "@/features/artists/types";

/** GET /festivals 목록 항목. RecentFestival과 shape이 같다 (venueName 없음) */
export type Festival = {
  festivalId: number;
  name: string;
  startDate: string;
  endDate: string;
  posterUrl: string | null;
  host: HostSummary;
};

/** 명세서 1.2 공통 페이지네이션 응답 포맷 (page는 0-based) */
export type PaginatedFestivals = {
  items: Festival[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type FestivalSort = "LATEST" | "UPCOMING";

/** GET /festivals/{id} 응답 중 host 필드 — 목록 카드의 HostSummary와 달리 히어로의
 * 인스타그램·공식 사이트 링크에 필요한 필드가 추가로 있다 */
export type FestivalHostSummary = {
  id: number;
  type: string;
  name: string;
  logoUrl: string | null;
  instagramUrl: string | null;
  homepageUrl: string | null;
};

/** revealed로 id/name/imageUrl/genre 유무가 갈린다 — 판별 유니온이라 !(non-null assertion) 없이 좁혀진다 */
export type LineupArtist = { order: number } & (
  | {
      revealed: true;
      id: number;
      name: string;
      imageUrl: string | null;
      genre: ArtistGenre | null;
    }
  | { revealed: false; id: null; name: null; imageUrl: null; genre: null }
);

export type LineupDay = {
  day: number;
  date: string;
  artists: LineupArtist[];
};

export type ExternalVisitor = "ALLOWED" | "CONDITIONAL" | "DENIED";
export type Verification =
  | "NONE"
  | "STUDENT_ID"
  | "PRE_BOOKING"
  | "INVITATION"
  | "OTHER";
export type TicketType = "FREE" | "PAID";

export type Admission = {
  externalVisitor: ExternalVisitor;
  verification: Verification;
  ticketType: TicketType;
  ticketOpenAt: string | null;
  note: string | null;
};

export type Location = {
  venueName: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** GET /festivals/{id} */
export type FestivalDetail = {
  id: number;
  name: string;
  host: FestivalHostSummary;
  startDate: string;
  endDate: string;
  /** 서버가 계산한 값(숫자) — 다시 계산하지 않고 포맷만 한다 */
  dday: number;
  posterUrl: string | null;
  lineup: LineupDay[];
  admission: Admission;
  location: Location;
};
