/**
 * 관리자 축제 검수 API. adminFetch가 인증 헤더·/api 접두사·에러 계약을 전담하므로
 * 여기는 경로 조립과 응답 타입만 맡는다.
 */
import { adminFetch } from "@/lib/adminFetch";
import type { PageResponse } from "@/types/api";
import type {
  AdminFestival,
  FestivalPublishResponse,
  FestivalReviewParams,
} from "@/features/admin/festival/types";

/**
 * GET /admin/festivals
 *
 * q는 빈 문자열이면 파라미터에서 뺀다 — 보내면 서버가 `LIKE '%%'`로 받아 전건
 * 매칭이 되고, "검색 안 함"과 구분이 안 된다.
 */
export async function getFestivals(
  params: FestivalReviewParams,
): Promise<PageResponse<AdminFestival>> {
  const qs = new URLSearchParams();
  if (params.published !== undefined) qs.set("published", String(params.published));
  if (params.discovery) qs.set("discovery", params.discovery);
  if (params.q) qs.set("q", params.q);
  qs.set("page", String(params.page));
  qs.set("size", String(params.size));

  return adminFetch<PageResponse<AdminFestival>>(`/admin/festivals?${qs.toString()}`);
}

/** POST /admin/festivals/{id}/publish — 멱등. 이미 발행이면 그대로 200 */
export async function publishFestival(
  festivalId: number,
): Promise<FestivalPublishResponse> {
  return adminFetch<FestivalPublishResponse>(`/admin/festivals/${festivalId}/publish`, {
    method: "POST",
  });
}

/** DELETE /admin/festivals/{id}/publish — 멱등. 이미 미발행이어도 200 */
export async function unpublishFestival(
  festivalId: number,
): Promise<FestivalPublishResponse> {
  return adminFetch<FestivalPublishResponse>(`/admin/festivals/${festivalId}/publish`, {
    method: "DELETE",
  });
}
