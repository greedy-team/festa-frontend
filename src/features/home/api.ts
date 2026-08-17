import { fetchJson, type ApiResult } from "@/lib/api";
import type { RecentFestival, UpcomingFestival } from "@/features/home/types";

/** 다가오는 축제. ENDED 제외, startDate 오름차순. limit 1~50 */
export async function getUpcomingFestivals(
  limit = 12,
): Promise<ApiResult<UpcomingFestival[]>> {
  const res = await fetchJson<{ items: UpcomingFestival[] }>(
    `/festivals/upcoming?limit=${limit}`,
  );
  return res.ok ? { ok: true, data: res.data.items ?? [] } : res;
}

/** 최근 등록된 축제. 등록 역순. limit 1~30 */
export async function getRecentFestivals(
  limit = 5,
): Promise<ApiResult<RecentFestival[]>> {
  const res = await fetchJson<{ items: RecentFestival[] }>(
    `/festivals/recent?limit=${limit}`,
  );
  return res.ok ? { ok: true, data: res.data.items ?? [] } : res;
}
