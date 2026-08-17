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
