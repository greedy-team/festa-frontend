import { notFound } from "next/navigation";
import { getArtist } from "@/features/artists/api";
import { ArtistHero } from "@/features/artists/components/ArtistHero";
import { UpcomingShowsSection } from "@/features/artists/components/UpcomingShowsSection";
import { AppearancesSection } from "@/features/artists/components/AppearancesSection";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/ui/AdSlot";
import { PageFadeIn } from "@/components/ui/PageFadeIn";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArtistDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const res = await getArtist(id);
  if (!res.ok) {
    if (res.status === 404) notFound();
    console.error("GET /artists/{id} 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="mt-10 text-body text-muted">아티스트 정보를 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const artist = res.data;

  return (
    // 카드 클릭으로 들어오는 화면이라 뚝 뜨지 않고 진입 시 전체가 한 번
    // 부드럽게 나타나게 한다(축제 상세와 같은 PageFadeIn).
    <PageFadeIn>
      <Container className="mt-10 mb-16 flex flex-col gap-16">
        <ArtistHero artist={artist} />

        {/* 시안(09-2)은 예정 공연(넓게) / 출연 이력(좁게) 2단 좌우 배치다 */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <UpcomingShowsSection
            artistId={artist.id}
            items={artist.upcomingShows.items}
            total={artist.upcomingShows.total}
          />
          <AppearancesSection
            artistId={artist.id}
            items={artist.appearances.items}
            total={artist.appearances.total}
          />
        </div>

        {/* DEC-0087: 로그인 없는 개인화 영역은 페이지당 광고 하나로 대체.
            시안(09-2)은 두 컬럼 전체 폭 아래에 걸쳐 있다 — 예정 공연 컬럼에만
            좁게 넣었던 걸 바로잡았다 */}
        <AdSlot variant="banner" />
      </Container>
    </PageFadeIn>
  );
}
