/**
 * 관리자 라인업 API. 경로는 축제 아래 중첩이다 (DEC-0151) — festivalId는 경로에만
 * 있고 본문에 없다. 그 축제의 라인업이 아니면 404다 (소유 대조).
 */
import { adminFetch } from "@/lib/adminFetch";
import type { AdminLineup, LineupFormValues } from "@/features/admin/lineup/types";

/**
 * GET /admin/festivals/{festivalId}/lineups — backend#122 신설.
 * 발행 여부와 관계없이 전체를 day·displayOrder 오름차순으로 내린다.
 * 응답은 배열이 아니라 `{ items: [...] }`다 (다른 목록 응답과 같은 ItemsResponse).
 */
export async function getLineups(festivalId: number): Promise<AdminLineup[]> {
  const response = await adminFetch<{ items: AdminLineup[] }>(
    `/admin/festivals/${festivalId}/lineups`,
  );
  return response.items;
}

/**
 * 폼 → 요청 본문. artistId를 비우면 시크릿 게스트 — null로 보낸다.
 * 숫자는 Number로 확정해 보낸다 (festivalForm.ts와 같은 이유).
 */
export function toLineupRequestBody(values: LineupFormValues) {
  return {
    artistId: values.artistId === "" ? null : Number(values.artistId),
    day: Number(values.day),
    displayOrder: Number(values.displayOrder),
  };
}

export async function createLineup(
  festivalId: number,
  values: LineupFormValues,
): Promise<AdminLineup> {
  return adminFetch<AdminLineup>(`/admin/festivals/${festivalId}/lineups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toLineupRequestBody(values)),
  });
}

/** PATCH — 「전체 교체다. 보낸 것이 전부다」 (Swagger) */
export async function updateLineup(
  festivalId: number,
  lineupId: number,
  values: LineupFormValues,
): Promise<AdminLineup> {
  return adminFetch<AdminLineup>(`/admin/festivals/${festivalId}/lineups/${lineupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toLineupRequestBody(values)),
  });
}

export async function deleteLineup(festivalId: number, lineupId: number): Promise<void> {
  await adminFetch<void>(`/admin/festivals/${festivalId}/lineups/${lineupId}`, {
    method: "DELETE",
  });
}
