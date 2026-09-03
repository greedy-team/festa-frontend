/**
 * 관리자 주최 API. adminFetch가 인증 헤더·베이스 URL·에러 계약을 전담한다
 * (features/admin/artist/api.ts와 같은 결).
 */
import { adminFetch } from "@/lib/adminFetch";
import type { PageResponse } from "@/types/api";
import type { AdminHost, HostFormValues, HostListParams } from "@/features/admin/host/types";

/** GET /admin/hosts — 등록 역순. 검색·필터가 없어 페이지네이션만 싣는다 */
export async function getHosts(params: HostListParams): Promise<PageResponse<AdminHost>> {
  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });
  return adminFetch<PageResponse<AdminHost>>(`/admin/hosts?${qs.toString()}`);
}

/** GET /admin/hosts/{id} — 수정 폼을 채우는 값 (DEC-0140) */
export async function getHost(hostId: number): Promise<AdminHost> {
  return adminFetch<AdminHost>(`/admin/hosts/${hostId}`);
}

export async function createHost(values: HostFormValues): Promise<AdminHost> {
  return adminFetch<AdminHost>("/admin/hosts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * PATCH /admin/hosts/{id} — Swagger가 「전체 교체다」로 못박은 그것이다.
 * DEC-0141에 따라 값을 골라 담지 않고 폼 상태를 그대로 보낸다.
 */
export async function updateHost(
  hostId: number,
  values: HostFormValues,
): Promise<AdminHost> {
  return adminFetch<AdminHost>(`/admin/hosts/${hostId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/** DELETE /admin/hosts/{id} — 204. 축제가 등록된 주최는 409로 막힌다 */
export async function deleteHost(hostId: number): Promise<void> {
  await adminFetch<void>(`/admin/hosts/${hostId}`, { method: "DELETE" });
}
