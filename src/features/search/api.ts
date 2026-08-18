import { fetchJson, type ApiResult } from "@/lib/api";
import type { SearchResponse, SearchType } from "@/features/search/types";

type Params = {
  q: string;
  type?: SearchType;
};

export async function search({
  q,
  type = "ALL",
}: Params): Promise<ApiResult<SearchResponse>> {
  const params = new URLSearchParams({ q, type });
  return fetchJson<SearchResponse>(`/search?${params}`);
}
