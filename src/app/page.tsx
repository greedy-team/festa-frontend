import { getRecentFestivals, getUpcomingFestivals } from "@/features/home/api";
import { Hero } from "@/features/home/components/Hero";
import { RecentCard } from "@/features/home/components/RecentCard";
import { LostPanel } from "@/features/home/components/LostPanel";
import { AdSlot } from "@/features/home/components/AdSlot";
import { Container } from "@/components/layout/Container";
import { SectionHeaderRow } from "@/components/ui/SectionHeaderRow";

export default async function Home() {
  const [upcomingRes, recentRes] = await Promise.all([
    getUpcomingFestivals(),
    getRecentFestivals(),
  ]);

  // 실패해도 throw하지 않는다 — Hero는 빈 배열을 이미 "표시할 축제가 없습니다"로 처리한다.
  const upcoming = upcomingRes.ok ? upcomingRes.data : [];
  const recent = recentRes.ok ? recentRes.data : [];

  return (
    <>
      <Hero festivals={upcoming} />

      <Container className="mt-16">
        {/* /festivals 목록 화면이 아직 없다. 히어로의 "자세히 보기"(#41)와 달리 클릭
            인터랙션 결정이 필요한 건 아니고 페이지 자체가 안 만들어진 것뿐이라, 생기면
            바로 이 href만 바꾸면 된다. */}
        <SectionHeaderRow title="최근 등록된 축제" href="/" />
        <div className="mt-[52px] grid grid-cols-5 gap-[25px]">
          {recent.map((festival) => (
            <RecentCard key={festival.festivalId} festival={festival} />
          ))}
        </div>
      </Container>

      {/* 시안의 560:680 비율을 유지하면서 컨테이너 폭을 꽉 채운다 — 고정폭(560px+680px)으로
          두면 컨테이너가 1280보다 넓을 때 위 카드 그리드 오른쪽 끝과 어긋난다. */}
      {/* mb-16: 섹션 간격 64 — Footer 앞에도 위 섹션들과 같은 간격을 둔다 */}
      <Container className="mt-16 mb-16 grid grid-cols-1 gap-10 sm:grid-cols-[560fr_680fr]">
        <LostPanel />
        <AdSlot />
      </Container>
    </>
  );
}
