import { afterEach, describe, expect, it, vi } from "vitest";
import { listingMetadata, pageMetadata } from "./seo";
import nextConfig from "../../next.config";

afterEach(() => vi.unstubAllEnvs());

it("프리뷰 전체를 noindex하고 프로덕션에서는 showcase만 헤더로 제외한다", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  expect(await nextConfig.headers?.()).toEqual([{
    source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
  }]);
  vi.stubEnv("VERCEL_ENV", "production");
  expect(await nextConfig.headers?.()).toEqual([{
    source: "/showcase/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
  }]);
});

describe("공개 페이지 메타데이터", () => {
  it("상세 페이지의 대표 URL과 공유 제목을 홈 값으로 덮지 않는다", () => {
    const metadata = pageMetadata("/festivals/12", "가을 축제", "실제 축제 설명");
    expect(metadata.alternates?.canonical).toBe("/festivals/12");
    expect(metadata.openGraph).toMatchObject({
      url: "/festivals/12", title: "가을 축제 | FESTA", description: "실제 축제 설명",
      images: [{ url: "/festa-og-image.jpg", width: 1729, height: 910 }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title: "가을 축제 | FESTA" });
  });

  it("페이지네이션은 자체 canonical을 갖고 검색 필터만 noindex 처리한다", () => {
    const paginated = listingMetadata("/artists", "아티스트", "설명", { page: "2" });
    expect(paginated.alternates?.canonical).toBe("/artists?page=2");
    expect(paginated.robots).toBeUndefined();
    const filtered = listingMetadata("/artists", "아티스트", "설명", { page: "2", q: "아이유" });
    expect(filtered.robots).toEqual({ index: false, follow: true });
    expect(filtered.alternates?.canonical).toBe(`/artists?page=2&q=${encodeURIComponent("아이유")}`);
  });

  it("빈 필터, 첫 페이지, 추적 파라미터는 canonical에서 제거한다", () => {
    const metadata = listingMetadata("/festivals", "축제", "설명", { page: "0", q: " ", utm_source: "share" });
    expect(metadata.alternates?.canonical).toBe("/festivals");
    expect(metadata.robots).toBeUndefined();
  });
});
