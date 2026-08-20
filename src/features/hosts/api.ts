import { fetchJson, type ApiResult } from "@/lib/api";
import type { HostDetail } from "@/features/hosts/types";

export async function getHost(id: number): Promise<ApiResult<HostDetail>> {
  return fetchJson<HostDetail>(`/hosts/${id}`);
}
