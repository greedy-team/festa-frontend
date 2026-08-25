import { getRecentFestivals, getUpcomingFestivals } from "@/features/home/api";
import { Hero } from "@/features/home/components/Hero";
import { RecentCard } from "@/features/home/components/RecentCard";
import { LostPanel } from "@/features/home/components/LostPanel";
import { AdSlot } from "@/components/ui/AdSlot";
import { Container } from "@/components/layout/Container";
import { SectionHeaderRow } from "@/components/ui/SectionHeaderRow";
import { FadeInSection } from "@/components/ui/FadeInSection";

export default async function Home() {
  const [upcomingRes, recentRes] = await Promise.all([
    getUpcomingFestivals(),
    getRecentFestivals(),
  ]);

  // 실패와 "0건"을 구분한다 — 둘 다 같은 빈 화면으로 뭉개면 API가 죽어도
  // "정상, 그냥 없음"으로 보인다 (lib/api.ts 독블록). 문구는 고정으로 두고
  // (DEC-0041: message는 개발자용), 서버 로그에만 원인을 남긴다.
  if (!upcomingRes.ok) {
    console.error("GET /festivals/upcoming 실패", upcomingRes.status, upcomingRes.message);
  }
  if (!recentRes.ok) {
    console.error("GET /festivals/recent 실패", recentRes.status, recentRes.message);
  }

  const upcoming = upcomingRes.ok ? upcomingRes.data : [];
  const recent = recentRes.ok ? recentRes.data : [];

  return (
    <>
      {upcomingRes.ok ? (
        <Hero festivals={upcoming} />
      ) : (
        <section className="flex h-[calc(100vh-72px)] min-h-[420px] max-h-[952px] items-center justify-center bg-canvas">
          <p className="text-body text-muted">축제 정보를 불러오지 못했습니다.</p>
        </section>
      )}

      {/* 히어로가 화면을 꽉 채우고 나서 내려오는 첫 섹션이라, 뚝 끊기지 않고
          부드럽게 나타나게 한다(스크롤재킹 없이 가벼운 느낌만). */}
      <FadeInSection>
        {/* 히어로 바로 다음이라 다른 섹션 간격(mt-16)보다 위쪽 여백을 더 준다 */}
        <Container className="mt-20">
          {/* /festivals 목록 화면이 생겼다 (같은 PR의 축제 목록 조립 커밋) */}
          <SectionHeaderRow title="최근 등록된 축제" href="/festivals" />
          {recentRes.ok ? (
            <div className="mt-5 grid grid-cols-2 gap-[25px] sm:grid-cols-3 lg:grid-cols-5">
              {recent.map((festival) => (
                <RecentCard key={festival.festivalId} festival={festival} />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-body text-muted">
              최근 등록된 축제를 불러오지 못했습니다.
            </p>
          )}
        </Container>
      </FadeInSection>

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
