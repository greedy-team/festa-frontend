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
      {/* 이 화면만 읽기 폭을 좁힌다 — 이름·타임라인 텍스트가 위주라 Container의
          기본 유동 폭(상한 없음)을 그대로 쓰면 큰 모니터에서 한 줄이 너무
          길어져 읽기 불편하다. 카드 행은 폭이 좁아져도 가로 스크롤로 그대로 동작한다. */}
      <Container className="mt-10 mb-16 flex max-w-[1200px] flex-col gap-16 mx-auto">
        <ArtistHero artist={artist} />

        {/* 시안(09-2)은 예정 공연(넓게) / 출연 이력(좁게) 2단 좌우 배치였는데,
            둘을 세로로 전폭 스택으로 바꿨다 — 예정 공연은 포스터 카드 가로
            스크롤이라 폭이 좁아지면 카드가 눌리고, 출연 이력은 타임라인이라
            세로 흐름과 더 잘 맞는다. 성격이 다른 두 콘텐츠(미래·행동 유도형 /
            과거·기록형)를 형태로도 구분한다. */}
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

        {/* DEC-0087: 로그인 없는 개인화 영역은 페이지당 광고 하나로 대체 */}
        <AdSlot variant="banner" />
      </Container>
    </PageFadeIn>
  );
}
