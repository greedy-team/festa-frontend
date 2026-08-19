import { notFound } from "next/navigation";
import { getArtist } from "@/features/artists/api";
import { ArtistHero } from "@/features/artists/components/ArtistHero";
import { UpcomingShowsSection } from "@/features/artists/components/UpcomingShowsSection";
import { AppearancesSection } from "@/features/artists/components/AppearancesSection";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/ui/AdSlot";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArtistDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  const res = await getArtist(id);
  if (!res.ok) notFound();
  const artist = res.data;

  return (
    <Container className="mt-10 mb-16 flex flex-col gap-10">
      <ArtistHero artist={artist} />

      {/* 시안(09-2)은 예정 공연(넓게) / 출연 이력(좁게) 2단 좌우 배치다 */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <UpcomingShowsSection
          items={artist.upcomingShows.items}
          total={artist.upcomingShows.total}
        />
        <AppearancesSection
          items={artist.appearances.items}
          total={artist.appearances.total}
        />
      </div>

      {/* DEC-0087: 로그인 없는 개인화 영역은 페이지당 광고 하나로 대체.
          시안(09-2)은 두 컬럼 전체 폭 아래에 걸쳐 있다 — 예정 공연 컬럼에만
          좁게 넣었던 걸 바로잡았다 */}
      <AdSlot variant="banner" />
    </Container>
  );
}
