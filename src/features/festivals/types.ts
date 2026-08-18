import type { HostSummary } from "@/features/home/types";

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

export type LineupArtist = {
  /** 미공개(revealed: false)면 null */
  id: number | null;
  name: string | null;
  imageUrl: string | null;
  genre: string | null;
  order: number;
  revealed: boolean;
};

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
