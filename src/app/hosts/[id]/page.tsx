import Link from "next/link";
import { notFound } from "next/navigation";
import { getHost } from "@/features/hosts/api";
import { HostHero } from "@/features/hosts/components/HostHero";
import { UpcomingFestivalsSection } from "@/features/hosts/components/UpcomingFestivalsSection";
import { FestivalHistorySection } from "@/features/hosts/components/FestivalHistorySection";
import { FrequentArtistsSection } from "@/features/hosts/components/FrequentArtistsSection";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/ui/AdSlot";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HostDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const res = await getHost(id);
  if (!res.ok) {
    if (res.status === 404) notFound();
    console.error("GET /hosts/{id} 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="mt-10 text-body text-muted">학교 정보를 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const host = res.data;

  return (
    <Container className="mt-10 mb-16">
      <nav className="flex items-center gap-1 text-meta text-muted-soft">
        <Link href="/">홈</Link>
        <span>›</span>
        <span>학교</span>
        <span>›</span>
        <span className="text-ink">{host.name}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-16">
        <HostHero host={host} />
        <UpcomingFestivalsSection festivals={host.upcomingFestivals} />
        <FestivalHistorySection
          hostId={id}
          items={host.festivalHistory.items}
          total={host.festivalHistory.total}
        />
        <FrequentArtistsSection artists={host.frequentArtists} />
        {/* DEC-0087: 로그인 없는 개인화 영역은 페이지당 광고 하나로 대체. 짝지을 섹션이
            없는 화면은 하단 배너형으로 둔다 */}
        <AdSlot variant="banner" />
      </div>
    </Container>
  );
}
