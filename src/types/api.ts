/**
 * 명세서 1.2 공통 페이지네이션 응답 포맷 (page는 0-based).
 *
 * features/artists/types.ts의 PaginatedArtists와 features/festivals/types.ts의
 * PaginatedFestivals가 같은 7필드를 각각 복사하고 있다. 관리자는 목록 도메인이
 * 5개라 같은 복사를 5번 더 하게 되므로 제네릭으로 둔다.
 * 기존 둘은 건드리지 않는다 — 망가지지 않은 것을 리팩터링하지 않는다.
 */
export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
