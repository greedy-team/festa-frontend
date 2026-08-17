import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { SpecimenSection } from "@/app/showcase/_components/Specimen";

export default function ShowcaseBadgePage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Badge</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md 4종 → variant 3. badge-day는 primary variant에 폭 64를 준
        것이다.
      </p>

      <SpecimenSection title="밝은 면">
        <Badge variant="primary">D-7</Badge>
        <Badge variant="primary" className="min-w-[64px]">
          DAY 1
        </Badge>
        <Badge variant="success">진행 중</Badge>
      </SpecimenSection>

      <SpecimenSection title="포스터 위 (on-media 전용)">
        <div className="flex w-full flex-wrap items-center gap-6 rounded-card bg-media-placeholder p-8">
          <Badge variant="on-media">D-2</Badge>
          <Badge variant="on-media">D-15</Badge>
        </div>
      </SpecimenSection>

      <p className="mt-8 text-caption text-muted">
        badge-dday는 홈 히어로에서 쓰지 않는다. 홈의 D-day는 56/700 타이포다
        (DESIGN.md Don&apos;ts).
      </p>
    </Container>
  );
}
