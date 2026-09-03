/**
 * 관리자 축제 검수 API. adminFetch가 인증 헤더·/api 접두사·에러 계약을 전담하므로
 * 여기는 경로 조립과 응답 타입만 맡는다.
 */
import { adminFetch } from "@/lib/adminFetch";
import type { PageResponse } from "@/types/api";
import type {
  AdminFestival,
  AdminFestivalDetail,
  FestivalFormValues,
  FestivalPublishResponse,
  FestivalReviewParams,
} from "@/features/admin/festival/types";
import { toFestivalRequestBody } from "@/features/admin/festival/festivalForm";

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

/** GET /admin/festivals/{id} — 수정 폼을 채우는 값 (DEC-0140) */
export async function getFestival(festivalId: number): Promise<AdminFestivalDetail> {
  return adminFetch<AdminFestivalDetail>(`/admin/festivals/${festivalId}`);
}

export async function createFestival(
  values: FestivalFormValues,
): Promise<AdminFestivalDetail> {
  return adminFetch<AdminFestivalDetail>("/admin/festivals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toFestivalRequestBody(values)),
  });
}

/**
 * PATCH /admin/festivals/{id} — Swagger가 「전체 교체다」로 못박은 그것이다.
 * DEC-0141에 따라 값을 골라 담지 않고 폼 상태 전체를 보낸다.
 */
export async function updateFestival(
  festivalId: number,
  values: FestivalFormValues,
): Promise<AdminFestivalDetail> {
  return adminFetch<AdminFestivalDetail>(`/admin/festivals/${festivalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toFestivalRequestBody(values)),
  });
}

/**
 * DELETE /admin/festivals/{id} — 204.
 * 발행 중이면 FESTIVAL_ALREADY_PUBLISHED, 라인업이 남아 있으면 FESTIVAL_HAS_LINEUPS.
 * 가드 순서는 발행 검사가 먼저다 — 화면 문구도 그 순서를 따른다.
 */
export async function deleteFestival(festivalId: number): Promise<void> {
  await adminFetch<void>(`/admin/festivals/${festivalId}`, { method: "DELETE" });
}
