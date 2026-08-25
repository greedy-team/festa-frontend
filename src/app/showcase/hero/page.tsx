// 화살표·도트 표본에 핸들러를 넘겨야 해서 클라이언트 컴포넌트다.
// 데이터 페칭은 없다 — 표본은 고정 데이터로 그린다.
"use client";

import { Container } from "@/components/layout/Container";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { slideBasisClass } from "@/features/home/components/Hero";
import { HeroArrow } from "@/components/ui/HeroArrow";
import { HeroDots } from "@/components/ui/HeroDots";
import {
  Specimen,
  SpecimenSection,
} from "@/app/showcase/_components/Specimen";
import {
  SAMPLE_UPCOMING,
  SAMPLE_UPCOMING_LIST,
} from "@/app/showcase/_components/samples";

export default function ShowcaseHeroPage() {
  return (
    <Container className="py-8">
      <h1 className="text-section-title text-ink">Home Hero</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md 06-D 히어로를 이루는 부품들. 조립된 캐러셀이 아니라 부품
        하나씩이다.
      </p>

      <SpecimenSection title="Panel">
        <Specimen name="hero-panel" size="360×952" usedIn="06-C, 06-D">
          {/* 시안 실측 크기 그대로 보여준다. 좁은 화면에서는 폭만 줄어든다 */}
          <div className="h-[952px] w-[360px] max-w-full">
            <HeroPanel festival={SAMPLE_UPCOMING} />
          </div>
        </Specimen>
      </SpecimenSection>

      <SpecimenSection title="패널 폭 — 축제 개수별">
        {/* 실제 Hero는 h-[calc(100vh-72px)]라 표본에 그대로 못 넣는다.
            같은 slideBasisClass를 실제 화면 폭 데스크톱 기준(lg)으로
            재현해서, 개수가 슬롯(4)보다 적을 때 빈 칸 없이 채워지는 걸
            보여준다. HeroPanel 내부 텍스트가 top-[68px]/bottom-14 같은
            절대 좌표라, 너무 낮은 상자에 넣으면 D-day와 정보 블록이
            겹친다 — 520px는 그 둘이 안 겹치는 최소한이다. */}
        {[1, 2, 3].map((n) => (
          <Specimen key={n} name={`축제 ${n}개`} size={`lg 기준, 슬롯 4개 중 ${n}개 사용`} full>
            <div className="flex h-[520px] w-full">
              {SAMPLE_UPCOMING_LIST.slice(0, n).map((festival) => (
                <div key={festival.festivalId} className={slideBasisClass(n)}>
                  <HeroPanel festival={festival} />
                </div>
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenSection>

      <SpecimenSection title="Controls">
        <Specimen name="hero-arrow" size="48" usedIn="06-D">
          <div className="flex gap-4">
            <HeroArrow direction="prev" onClick={() => {}} />
            <HeroArrow direction="next" onClick={() => {}} />
          </div>
        </Specimen>

        <Specimen name="hero-arrow · disabled" size="48" usedIn="06-D">
          <div className="flex gap-4">
            <HeroArrow direction="prev" onClick={() => {}} disabled />
            <HeroArrow direction="next" onClick={() => {}} disabled />
          </div>
        </Specimen>

        <Specimen name="hero-dots" size="h44" usedIn="06-D">
          <HeroDots count={3} current={0} onSelect={() => {}} />
        </Specimen>

        <Specimen name="hero-dots · 8페이지" size="h44" usedIn="06-D">
          <HeroDots count={8} current={2} onSelect={() => {}} />
        </Specimen>
      </SpecimenSection>

      <p className="mt-16 text-label text-muted-soft">
        도트 개수는 고정값이 아니라 `ceil(축제 수 / 화면에 보이는 패널 수)`로
        계산한다. 시안의 8개는 축제 32개를 전제한 그림이다.
      </p>
      <p className="mt-2 text-label text-muted-soft">
        패널 전체가 링크다 — 클릭하면 요약 없이 축제 상세로 직행한다(DEC-0060).
        이 표본에서는 실제 이동을 막기 위해 감싸는 div에 고정 크기만 줬다.
      </p>
    </Container>
  );
}
