import { fetchJson, type ApiResult } from "@/lib/api";
import type { Host } from "@/features/hosts/types";

export async function getHost(hostId: number): Promise<ApiResult<Host>> {
  return fetchJson<Host>(`/hosts/${hostId}`);
}
