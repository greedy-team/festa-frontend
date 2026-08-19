import { fetchJson, type ApiResult } from "@/lib/api";
import type { PaginatedFestivals, FestivalSort } from "@/features/festivals/types";

type Params = {
  /** 0-based */
  page?: number;
  size?: number;
  sort?: FestivalSort;
  hostId?: number;
  year?: number;
};

/** 축제 목록. page/size/sort는 GET /festivals 그대로 전달. hostId/year는 학교별 축제 이력(#51)에서 쓴다 */
export async function getFestivals({
  page = 0,
  size = 10,
  sort = "LATEST",
  hostId,
  year,
}: Params = {}): Promise<ApiResult<PaginatedFestivals>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (hostId) params.set("hostId", String(hostId));
  if (year) params.set("year", String(year));

  return fetchJson<PaginatedFestivals>(`/festivals?${params}`);
}
