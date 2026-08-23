/**
 * 이 파일의 함수들은 실패 시 AdminApiError를 throw한다 — features/admin/auth/api.ts와
 * 같은 방식이다. src/lib/api.ts의 던지지 않는 ApiResult<T> 관례과는 의도적으로 다르다.
 * TanStack Query의 useQuery는 queryFn이 throw해야만 isError를 true로 세운다 — ApiResult처럼
 * 에러를 성공 값 안에 담아 resolve하면 useQuery는 그것을 성공으로 보고, 화면은 isError
 * 분기를 타지 못한 채 빈 표를 그대로 그린다. 실제 adminFetch를 구현할 때 lib/api.ts를
 * 먼저 읽고 그 관례를 따르기 쉬우므로 여기 남겨둔다.
 */
import type { PageResponse } from "@/types/api";
import {
  PUBLISH_BLOCKER,
  type AdminFestival,
  type BulkPublishResult,
  type FestivalReviewParams,
  type PublishBlockerReason,
} from "@/features/admin/festival/types";
import { adminFestivalsFixture } from "@/features/admin/festival/fixtures";

/**
 * 픽스처는 모듈 스코프에 두고 여기서만 바꾼다. 새로고침하면 초기화된다 —
 * 목의 목적은 화면 검증이지 데이터 보존이 아니다.
 */
let rows: AdminFestival[] = adminFestivalsFixture;

/**
 * 백엔드 연결일에 이 본문이 adminFetch 호출로 바뀐다:
 *   return adminFetch<PageResponse<AdminFestival>>(`/admin/festivals?${qs}`)
 * 시그니처와 반환 타입은 그대로다.
 */
export async function getFestivals(
  params: FestivalReviewParams,
): Promise<PageResponse<AdminFestival>> {
  const filtered = rows.filter((festival) => {
    if (params.published !== undefined && festival.published !== params.published) return false;
    if (params.discovery && festival.discovery !== params.discovery) return false;
    if (params.q && !festival.name.includes(params.q)) return false;
    return true;
  });

  const start = params.page * params.size;
  const items = filtered.slice(start, start + params.size);
  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / params.size));

  return {
    items,
    page: params.page,
    size: params.size,
    totalElements,
    totalPages,
    hasNext: start + params.size < totalElements,
    hasPrevious: params.page > 0,
  };
}

/**
 * 칩 건수용. 필터와 무관한 전체 집계라 목록과 따로 부른다.
 *
 * 실제 API 뒤에는 이 호출을 받쳐줄 전용 엔드포인트가 없다 (스펙 §1 — 축제 검수 화면에는
 * GET /admin/festivals와 발행 3종만 있다). 백엔드 연결 시에는 필터 상태(unpublished /
 * published / 전체)마다 size=1로 GET /admin/festivals를 한 번씩, 총 세 번 불러
 * totalElements만 읽어내는 방식이 된다 — 요청 3개의 비용이 감당할 만한지는 아직
 * 결정되지 않았다.
 */
export async function getFestivalCounts(): Promise<{
  unpublished: number;
  published: number;
  total: number;
}> {
  return {
    unpublished: rows.filter((festival) => !festival.published).length,
    published: rows.filter((festival) => festival.published).length,
    total: rows.length,
  };
}

/**
 * DOC-0007 「발행 조건」: LINEUP_EMPTY(라인업 0건) · HOST_NOT_LINKED(주최 미연결).
 * 위경도는 목록 응답에 없어 프론트가 판정할 수 없다 — 서버가 failed[]로 알려준다.
 */
export function publishBlocker(
  festival: AdminFestival,
): PublishBlockerReason | null {
  if (festival.lineupCount === 0) return PUBLISH_BLOCKER.LINEUP_EMPTY;
  if (festival.hostId === null) return PUBLISH_BLOCKER.HOST_NOT_LINKED;
  return null;
}

/** POST /admin/festivals/publish — 부분 성공 허용 */
export async function publishFestivals(
  ids: number[],
): Promise<BulkPublishResult> {
  const failed = ids
    .map((id) => rows.find((festival) => festival.festivalId === id))
    .filter((festival): festival is AdminFestival => Boolean(festival))
    .filter((festival) => publishBlocker(festival) !== null)
    .map((festival) => ({
      festivalId: festival.festivalId,
      name: festival.name,
      reason: publishBlocker(festival) as PublishBlockerReason,
      message: "발행 조건을 만족하지 않습니다",
    }));

  const failedIds = new Set(failed.map((failure) => failure.festivalId));
  const publishedIds = ids.filter((id) => !failedIds.has(id));

  // 새 배열로 갈아끼운다 — 제자리 변형하지 않는다.
  rows = rows.map((festival) =>
    publishedIds.includes(festival.festivalId)
      ? { ...festival, published: true }
      : festival,
  );

  return {
    requested: ids.length,
    published: publishedIds.length,
    publishedIds,
    failed,
  };
}

/** DELETE /admin/festivals/{id}/publish — affected는 뺀다 (스펙 §2) */
export async function unpublishFestival(
  festivalId: number,
): Promise<{ festivalId: number; published: boolean; unpublishedAt: string }> {
  rows = rows.map((festival) =>
    festival.festivalId === festivalId ? { ...festival, published: false } : festival,
  );
  return {
    festivalId,
    published: false,
    unpublishedAt: new Date().toISOString(),
  };
}
