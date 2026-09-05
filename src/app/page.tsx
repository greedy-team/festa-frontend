import { getRecentFestivals, getUpcomingFestivals } from "@/features/home/api";
import { getArtists } from "@/features/artists/api";
import { Hero } from "@/features/home/components/Hero";
import { RecentCard } from "@/features/home/components/RecentCard";
import { AdSlot } from "@/components/ui/AdSlot";
import { Container } from "@/components/layout/Container";
import { HeroSurface } from "@/components/layout/HeroSurface";
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

  // 다가오는 축제가 0건일 때만 아티스트를 부른다(DEC-0168). 위 Promise.all에
  // 끼우면 축제가 있는 평상시에도 쓰지 않을 목록을 매번 받아온다. 여기서만
  // 워터폴이 되지만, 그 지연은 축제가 0건인 화면에서만 생긴다.
  // 정렬이 출연 많은 순인 이유: 벽에서 앞자리가 큰 글자를 받으므로 자주 온
  // 아티스트가 크게 보인다 (지금은 축제가 1건이라 전원 1회로 같다).
  const artistsRes =
    upcomingRes.ok && upcoming.length === 0
      ? await getArtists({ page: 0, size: 50, sort: "APPEARANCES" })
      : null;

  if (artistsRes && !artistsRes.ok) {
    console.error("GET /artists 실패", artistsRes.status, artistsRes.message);
  }

  // 못 불러오면 undefined로 둔다 — Hero가 기존 메시 배경으로 되돌아간다.
  // 실패를 빈 벽으로 그리면 "아티스트가 없는 서비스"로 보인다(LSN-0013).
  const artists =
    artistsRes?.ok && artistsRes.data.items.length > 0
      ? {
          names: artistsRes.data.items.map((artist) => artist.name),
          total: artistsRes.data.totalElements,
        }
      : undefined;

  return (
    <>
      {upcomingRes.ok ? (
        <Hero festivals={upcoming} artists={artists} />
      ) : (
        // 히어로와 같은 자리·같은 크기·같은 어두운 톤 — 헤더가 홈에서는 첫 렌더부터
        // 투명(흰 글자)으로 그려지므로, 이 자리가 밝으면 헤더가 안 보인다 (SiteChrome.tsx).
        <HeroSurface className="flex items-center justify-center bg-hero-1 pt-[72px]">
          <p className="text-body text-on-media/85">축제 정보를 불러오지 못했습니다.</p>
        </HeroSurface>
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

      {/* 분실물 패널이 있던 자리다. 분실물은 MVP 밖이고(DEC-0061) 연동할 API도 없어
          상시 빈 패널이 되므로, 비활성으로 남기지 않고 걷어냈다(DEC-0129) — 헤더·푸터·
          히어로 빈 상태 바로가기와 같은 판정이다. 화면이 생기면 그 세 곳과 함께 되돌린다.
          짝이 사라져 광고 슬롯도 패널형(680×420)을 유지할 근거가 없어, 다른 화면과 같은
          배너형으로 맞춘다(페이지당 하나는 그대로, DEC-0087). */}
      {/* mt-16/mb-16: 섹션 간격 64 — Footer 앞에도 같은 간격을 둔다 */}
      <Container className="mt-16 mb-16">
        <AdSlot variant="banner" />
      </Container>
    </>
  );
}
