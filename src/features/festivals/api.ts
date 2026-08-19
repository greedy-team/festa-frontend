import { fetchJson, type ApiResult } from "@/lib/api";
import type { PaginatedFestivals, FestivalSort } from "@/features/festivals/types";

type Params = {
  /** 0-based */
  page?: number;
  size?: number;
  sort?: FestivalSort;
};

/** 축제 목록. page/size/sort는 GET /festivals 그대로 전달 */
export async function getFestivals({
  page = 0,
  size = 10,
  sort = "LATEST",
}: Params = {}): Promise<ApiResult<PaginatedFestivals>> {
  return fetchJson<PaginatedFestivals>(
    `/festivals?page=${page}&size=${size}&sort=${sort}`,
  );
}
