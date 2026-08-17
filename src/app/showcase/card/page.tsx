import { Container } from "@/components/layout/Container";
import { SectionHeaderRow } from "@/components/ui/SectionHeaderRow";
import { RecentCard } from "@/features/home/components/RecentCard";
import {
  Specimen,
  SpecimenSection,
} from "@/app/showcase/_components/Specimen";
import {
  SAMPLE_RECENT,
  SAMPLE_RECENT_LIST,
} from "@/app/showcase/_components/samples";

export default function ShowcaseCardPage() {
  return (
    <Container className="py-8">
      <h1 className="text-section-title text-ink">Card · Row</h1>
      <p className="mt-3 text-caption text-muted">
        `recent-card`는 `festival-card`와 다른 컴포넌트다 — 236×379에 포스터
        236×300이고 오버레이가 없다. 홈의 D-day는 히어로에만 있으므로 카드에
        상태 도트나 D-day 뱃지를 얹지 않는다.
      </p>

      <SpecimenSection title="Cards">
        <Specimen name="recent-card" size="236×379" usedIn="06-D">
          {/* 시안 실측 폭 그대로. 실제 화면에서는 그리드가 폭을 정한다 */}
          <div className="w-[236px] max-w-full">
            <RecentCard festival={SAMPLE_RECENT} />
          </div>
        </Specimen>

        <Specimen name="recent-card · 5-up 그리드" size="236 × 5" usedIn="06-D" full>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {SAMPLE_RECENT_LIST.map((festival) => (
              <RecentCard key={festival.festivalId} festival={festival} />
            ))}
          </div>
        </Specimen>
      </SpecimenSection>

      <SpecimenSection title="List Rows">
        <Specimen name="section-header-row" size="1280×32" usedIn="06-D" full>
          <SectionHeaderRow title="최근 등록된 축제" href="/showcase" />
        </Specimen>

        <Specimen
          name="section-header-row · 링크 없음"
          size="1280×32"
          usedIn="06-D"
          full
        >
          <SectionHeaderRow title="다가오는 축제" />
        </Specimen>
      </SpecimenSection>

      <p className="mt-16 text-label text-muted-soft">
        「전체 보기 →」의 목적지가 아직 없는 섹션은 `href`를 생략한다. 링크를
        그리지 않는다.
      </p>
      <p className="mt-2 text-label text-muted-soft">
        포스터가 없거나 로드에 실패하면 축제 id로 고른 틴트가 그대로 남는다.
        표본의 축제마다 색이 다른 것이 그 결과다.
      </p>
    </Container>
  );
}
