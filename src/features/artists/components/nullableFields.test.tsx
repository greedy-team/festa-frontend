import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ArtistRow } from "./ArtistRow";
import { UpcomingShowCard } from "./UpcomingShowCard";
import { HostHero } from "@/features/hosts/components/HostHero";
import { ArtistFormDialog } from "@/features/admin/artist/components/ArtistFormDialog";
import type { Artist, UpcomingShow } from "@/features/artists/types";
import type { HostDetail } from "@/features/hosts/types";

const artist: Artist = {
  artistId: 1, name: "PSY", imageUrl: null, genre: "DANCE", appearanceCount: 1,
  recentFestival: { festivalId: 1, name: "봄축제", hostShortName: null },
};
const host: HostDetail = {
  id: 1, name: "대학교", shortName: null, region: "서울", logoUrl: null,
  bannerUrl: null, homepageUrl: null, availableYears: [], upcomingFestivals: [],
  festivalHistory: { items: [], total: 0 }, frequentArtists: [],
};
const show: UpcomingShow = {
  festivalId: 1, name: "봄축제", hostName: "대학교", venueName: null,
  posterUrl: null, startDate: "2026-05-01", endDate: "2026-05-02",
  performanceDate: "2026-05-01", day: 1, dday: 1,
};

it("최근 출연의 학교 약칭이 없으면 축제명만 표시한다", () => {
  const html = renderToStaticMarkup(<ArtistRow artist={artist} />);
  expect(html).toContain("최근 봄축제");
  expect(html).not.toContain("null");
  expect(renderToStaticMarkup(<ArtistRow artist={{ ...artist, recentFestival: {
    ...artist.recentFestival!, hostShortName: "대학",
  } }} />)).toContain("최근 대학 봄축제");
});

it("주최 약칭·공연 장소가 없으면 빈 구분자를 남기지 않는다", () => {
  expect(renderToStaticMarkup(<HostHero host={host} />)).toContain(">서울</p>");
  expect(renderToStaticMarkup(<HostHero host={{ ...host, shortName: "대학" }} />))
    .toContain("대학 · 서울");
  expect(renderToStaticMarkup(<UpcomingShowCard show={show} />)).toContain(">대학교</span>");
  expect(renderToStaticMarkup(<UpcomingShowCard show={{ ...show, venueName: "운동장" }} />))
    .toContain("대학교 · 운동장");
});

it("아티스트 폼은 서버의 기존 검수 필드가 있어도 체크박스를 표시하지 않는다", () => {
  const existing = {
    artistId: 1, name: "PSY", otherNames: [], genre: null, imageUrl: null,
    instagramUrl: null, appearanceCount: 1, createdAt: "2026-09-01", needsReview: true,
  };
  const html = renderToStaticMarkup(
    <ArtistFormDialog artist={existing} onSubmit={() => {}} onClose={() => {}} />,
  );
  expect(html).not.toContain('type="checkbox"');
  expect(html).not.toContain("검수 필요");
  expect(html).toContain('value="PSY"');
});
