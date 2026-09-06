/**
 * 관리자 아티스트 API. adminFetch가 인증 헤더·베이스 URL·에러 계약을 전담하므로
 * 여기는 경로 조립과 응답 타입만 맡는다 (features/admin/festival/api.ts와 같은 결).
 */
import { adminFetch } from "@/lib/adminFetch";
import type { PageResponse } from "@/types/api";
import { enumOrNull } from "@/features/admin/_shared/enumField";
import type {
  AdminArtist,
  ArtistFormValues,
  ArtistListParams,
  ArtistMergeCandidates,
  ArtistMergeResult,
} from "@/features/admin/artist/types";

/**
 * GET /admin/artists
 *
 * q는 빈 문자열이면 파라미터에서 뺀다 — 보내면 서버가 `LIKE '%%'`로 받아 전건
 * 매칭이 되고 "검색 안 함"과 구분이 안 된다 (축제 목록과 같은 이유).
 */
export async function getArtists(
  params: ArtistListParams,
): Promise<PageResponse<AdminArtist>> {
  const qs = new URLSearchParams();
  if (params.needsReview !== undefined) qs.set("needsReview", String(params.needsReview));
  if (params.q) qs.set("q", params.q);
  if (params.genre) qs.set("genre", params.genre);
  if (params.sort) qs.set("sort", params.sort);
  qs.set("page", String(params.page));
  qs.set("size", String(params.size));

  return adminFetch<PageResponse<AdminArtist>>(`/admin/artists?${qs.toString()}`);
}

/** GET /admin/artists/{id} — 수정 폼을 채우는 값 (DEC-0140) */
export async function getArtist(artistId: number): Promise<AdminArtist> {
  return adminFetch<AdminArtist>(`/admin/artists/${artistId}`);
}

/** enum은 빈 문자열을 400으로 거절한다 — 「선택 안 함」은 null로 나간다 */
function toRequestBody(values: ArtistFormValues) {
  return { ...values, genre: enumOrNull(values.genre) };
}

export async function createArtist(values: ArtistFormValues): Promise<AdminArtist> {
  return adminFetch<AdminArtist>("/admin/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toRequestBody(values)),
  });
}

/**
 * PATCH /admin/artists/{id}
 *
 * DEC-0142: PATCH이지만 의미는 「보낸 것으로 덮는다」이며, DEC-0141에 따라 요청은
 * 항상 전체를 담는다. 그래서 여기서 값을 골라 담지 않고 폼 상태를 그대로 보낸다.
 */
export async function updateArtist(
  artistId: number,
  values: ArtistFormValues,
): Promise<AdminArtist> {
  return adminFetch<AdminArtist>(`/admin/artists/${artistId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toRequestBody(values)),
  });
}

/** DELETE /admin/artists/{id} — 204. 본문 없음은 adminFetch가 처리한다 */
export async function deleteArtist(artistId: number): Promise<void> {
  await adminFetch<void>(`/admin/artists/${artistId}`, { method: "DELETE" });
}

/** GET /admin/artists/{id}/merge-candidates — limit 기본 5, 1~20 */
export async function getMergeCandidates(
  artistId: number,
  limit = 5,
): Promise<ArtistMergeCandidates> {
  return adminFetch<ArtistMergeCandidates>(
    `/admin/artists/${artistId}/merge-candidates?limit=${limit}`,
  );
}

/** POST /admin/artists/merge — targetId에 sourceIds를 합친다. 되돌릴 수 없다 */
export async function mergeArtists(body: {
  targetId: number;
  sourceIds: number[];
  keepAliases: boolean;
}): Promise<ArtistMergeResult> {
  return adminFetch<ArtistMergeResult>("/admin/artists/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
