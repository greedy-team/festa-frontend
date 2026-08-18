import { fetchJson, type ApiResult } from "@/lib/api";
import type {
  PaginatedArtists,
  ArtistGenre,
  ArtistSort,
} from "@/features/artists/types";

type Params = {
  /** 0-based */
  page?: number;
  size?: number;
  genre?: ArtistGenre;
  sort?: ArtistSort;
};

/** 아티스트 목록. page/size/genre/sort는 GET /artists 그대로 전달 */
export async function getArtists({
  page = 0,
  size = 10,
  genre,
  sort = "APPEARANCES",
}: Params = {}): Promise<ApiResult<PaginatedArtists>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (genre) params.set("genre", genre);

  return fetchJson<PaginatedArtists>(`/artists?${params}`);
}
