// 화살표·도트 표본에 핸들러를 넘겨야 해서 클라이언트 컴포넌트다.
// 데이터 페칭은 없다 — 표본은 고정 데이터로 그린다.
"use client";

import { Container } from "@/components/layout/Container";
import { HeroPanel } from "@/features/home/components/HeroPanel";
import { HeroArrow } from "@/components/ui/HeroArrow";
import { HeroDots } from "@/components/ui/HeroDots";
import {
  Specimen,
  SpecimenSection,
} from "@/app/showcase/_components/Specimen";
import { SAMPLE_UPCOMING } from "@/app/showcase/_components/samples";

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
        패널 클릭 동작은 아직 없다 — DESIGN.md Known Gaps에 세 안이 경합 중이라
        팀이 정한 뒤 붙인다.
      </p>
    </Container>
  );
}
