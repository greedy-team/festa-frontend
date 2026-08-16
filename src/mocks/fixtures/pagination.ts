/**
 * 명세서 1.2 공통 페이지네이션 응답 포맷.
 * festivals / artists / hosts.festivalHistory 등 offset 기반 목록 API에서 공통으로 사용.
 */
export function paginate<T>(
  allItems: T[],
  page: number,
  size: number
) {
  const start = page * size;
  const end = start + size;
  const items = allItems.slice(start, end);
  const totalElements = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  return {
    items,
    page,
    size,
    totalElements,
    totalPages,
    hasNext: end < totalElements,
    hasPrevious: page > 0,
  };
}

export function parsePageParams(searchParams: URLSearchParams) {
  const page = Number(searchParams.get('page') ?? '0');
  const size = Number(searchParams.get('size') ?? '10');
  return { page, size };
}
