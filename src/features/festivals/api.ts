import { fetchJson, type ApiResult } from "@/lib/api";
import type {
  PaginatedFestivals,
  FestivalSort,
  FestivalDetail,
} from "@/features/festivals/types";

type Params = {
  /** 0-based */
  page?: number;
  size?: number;
  sort?: FestivalSort;
  hostId?: number;
  year?: number;
  artistId?: number;
  /** 축제명 검색어 — trim 후 50자 상한, 초과 시 백엔드가 400 (DEC-0160) */
  q?: string;
};

/** 축제 목록. page/size/sort는 GET /festivals 그대로 전달. hostId/year는 학교별 축제 이력(#51),
 * artistId는 아티스트 상세(#47)의 "더 보기", q는 축제 전체 화면의 이름 검색에서 쓴다 */
export async function getFestivals({
  page = 0,
  size = 10,
  sort = "LATEST",
  hostId,
  year,
  artistId,
  q,
}: Params = {}): Promise<ApiResult<PaginatedFestivals>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (hostId) params.set("hostId", String(hostId));
  if (year) params.set("year", String(year));
  if (artistId) params.set("artistId", String(artistId));
  if (q) params.set("q", q);

  return fetchJson<PaginatedFestivals>(`/festivals?${params}`);
}

export async function getFestival(id: number): Promise<ApiResult<FestivalDetail>> {
  return fetchJson<FestivalDetail>(`/festivals/${id}`);
}
