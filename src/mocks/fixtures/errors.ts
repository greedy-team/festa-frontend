import { HttpResponse } from 'msw';

/**
 * 확정: 응답 필드명은 `errorCode`. (예시: `{ "errorCode": "FESTIVAL_NOT_FOUND", "message": ..., "status": ..., "instance": ... }`)
 */
const ERROR_CODE_FIELD: 'code' | 'errorCode' = 'errorCode';

type FieldError = { field: string; reason: string };

export function apiError(
  code: string,
  message: string,
  status: number,
  instance: string,
  fieldErrors: FieldError[] = []
) {
  return HttpResponse.json(
    {
      [ERROR_CODE_FIELD]: code,
      message,
      status,
      instance,
      fieldErrors,
    },
    { status }
  );
}

/**
 * 도메인별 자주 쓰는 검증 에러를 짧게 부르기 위한 헬퍼.
 * 코드/상황/HTTP status는 에러 코드 마스터 문서(v1) 기준.
 */
export const Errors = {
  invalidPage: (instance: string) => apiError('INVALID_PAGE', 'page는 0 이상이어야 합니다.', 400, instance),
  invalidPageSize: (instance: string) => apiError('INVALID_PAGE_SIZE', 'size는 1~50 사이여야 합니다.', 400, instance),

  festivalNotFound: (instance: string) => apiError('FESTIVAL_NOT_FOUND', '존재하지 않는 축제입니다.', 404, instance),
  festivalInvalidSortType: (instance: string) => apiError('FESTIVAL_INVALID_SORT_TYPE', '지원하지 않는 정렬 값입니다.', 400, instance),
  festivalInvalidStatusType: (instance: string) => apiError('FESTIVAL_INVALID_STATUS_TYPE', '지원하지 않는 진행 상태 값입니다.', 400, instance),
  festivalInvalidYear: (instance: string) => apiError('FESTIVAL_INVALID_YEAR', '연도는 2000년 이상이어야 합니다.', 400, instance),
  // 기준 문서(개별 페이지 export)에서도 Query Parameter 표(upcoming 1~50 / recent 1~30)와
  // Status 표 설명("1~10 범위를 벗어남", 두 엔드포인트 모두 동일 문구)이 서로 다름 — 같은 문서
  // 안에서의 자체 모순이라 복붙 실수로 보임. Parameter 표(더 구체적인 쪽)를 기준으로 구현.
  // 여전히 팀 확인 필요.
  festivalInvalidLimit: (instance: string, min: number, max: number) =>
    apiError('FESTIVAL_INVALID_LIMIT', `limit은 ${min}~${max} 사이여야 합니다.`, 400, instance),
  festivalConflictingFilter: (instance: string) =>
    apiError('FESTIVAL_CONFLICTING_FILTER', 'artistId와 hostId는 동시에 지정할 수 없습니다.', 400, instance),

  artistNotFound: (instance: string) => apiError('ARTIST_NOT_FOUND', '존재하지 않는 아티스트입니다.', 404, instance),
  artistInvalidSortType: (instance: string) => apiError('ARTIST_INVALID_SORT_TYPE', '지원하지 않는 정렬 값입니다.', 400, instance),
  artistInvalidGenreType: (instance: string) => apiError('ARTIST_INVALID_GENRE_TYPE', '지원하지 않는 장르 값입니다.', 400, instance),

  hostNotFound: (instance: string) => apiError('HOST_NOT_FOUND', '존재하지 않는 주최입니다.', 404, instance),

  searchInvalidQuery: (instance: string) => apiError('SEARCH_INVALID_QUERY', '검색어를 입력해주세요.', 400, instance),
  searchInvalidType: (instance: string) => apiError('SEARCH_INVALID_TYPE', '지원하지 않는 검색 유형입니다.', 400, instance),
  searchInvalidLimit: (instance: string) => apiError('SEARCH_INVALID_LIMIT', 'limit은 1~10 사이여야 합니다.', 400, instance),

  internalError: (instance: string) => apiError('INTERNAL_ERROR', '처리되지 않은 서버 오류입니다.', 500, instance),
};
