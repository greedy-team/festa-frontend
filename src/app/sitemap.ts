import type { MetadataRoute } from "next";
import { getFestivals } from "@/features/festivals/api";
import { getArtists } from "@/features/artists/api";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(["/", "/festivals", "/artists"]);

  for (let page = 0; ; page++) {
    const res = await getFestivals({ page, size: 50 });
    // 실패를 빈 목록으로 제출하면 정상 URL이 사이트맵에서 사라진다.
    if (!res.ok) throw new Error(`Sitemap festivals: ${res.status} ${res.message}`);
    for (const festival of res.data.items) {
      paths.add(`/festivals/${festival.festivalId}`);
      paths.add(`/hosts/${festival.host.id}`);
      paths.add(`/hosts/${festival.host.id}/history`);
    }
    if (!res.data.hasNext) break;
  }

  for (let page = 0; ; page++) {
    const res = await getArtists({ page, size: 50, sort: "NAME" });
    if (!res.ok) throw new Error(`Sitemap artists: ${res.status} ${res.message}`);
    for (const artist of res.data.items) paths.add(`/artists/${artist.artistId}`);
    if (!res.data.hasNext) break;
  }

  return [...paths].map((path) => ({ url: new URL(path, SITE_URL).href }));
}
