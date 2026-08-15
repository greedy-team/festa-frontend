import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

export default function ShowcaseBadgePage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Badge</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md 4종 → 톤 3. badge-day는 primary 톤에 폭 64를 준 것이다.
      </p>

      <h2 className="mt-16 text-row-title text-ink">밝은 면</h2>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Badge tone="primary">D-7</Badge>
        <Badge tone="primary" className="w-[64px]">
          DAY 1
        </Badge>
        <Badge tone="success">진행 중</Badge>
      </div>

      <h2 className="mt-16 text-row-title text-ink">
        포스터 위 (on-media 전용)
      </h2>
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-card bg-media-placeholder p-8">
        <Badge tone="on-media">D-2</Badge>
        <Badge tone="on-media">D-15</Badge>
      </div>

      <p className="mt-8 text-caption text-muted">
        badge-dday는 홈 히어로에서 쓰지 않는다. 홈의 D-day는 56/700 타이포다
        (DESIGN.md Don&apos;ts).
      </p>
    </Container>
  );
}
