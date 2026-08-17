import { Container } from "@/components/layout/Container";

const COLORS = [
  ["primary", "bg-primary"],
  ["primary-soft", "bg-primary-soft"],
  ["secondary", "bg-secondary"],
  ["accent", "bg-accent"],
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["surface-field", "bg-surface-field"],
  ["media-placeholder", "bg-media-placeholder"],
  ["border", "bg-border"],
  ["border-strong", "bg-border-strong"],
  ["divider", "bg-divider"],
  ["ink", "bg-ink"],
  ["body-text", "bg-body-text"],
  ["body-strong", "bg-body-strong"],
  ["muted", "bg-muted"],
  ["muted-soft", "bg-muted-soft"],
  ["success", "bg-success"],
  ["success-soft", "bg-success-soft"],
  ["success-ink", "bg-success-ink"],
  ["scrim-hero", "bg-scrim-hero"],
  ["scrim-25", "bg-scrim-25"],
  ["scrim-30", "bg-scrim-30"],
  ["scrim-35", "bg-scrim-35"],
  ["hero-1", "bg-hero-1"],
  ["hero-2", "bg-hero-2"],
  ["hero-3", "bg-hero-3"],
  ["hero-4", "bg-hero-4"],
  ["grid-1", "bg-grid-1"],
  ["grid-2", "bg-grid-2"],
  ["grid-3", "bg-grid-3"],
  ["grid-4", "bg-grid-4"],
  ["grid-5", "bg-grid-5"],
] as const;

const TYPOGRAPHY = [
  ["hero-dday", "text-hero-dday", "56 / 700"],
  ["hero", "text-hero", "48 / 700"],
  ["section-title", "text-section-title", "36 / 700"],
  ["hero-name", "text-hero-name", "30 / 700"],
  ["card-title", "text-card-title", "28 / 700"],
  ["section-title-home", "text-section-title-home", "26 / 700"],
  ["sheet-title", "text-sheet-title", "26 / 700"],
  ["logo", "text-logo", "26 / 700"],
  ["logo-footer", "text-logo-footer", "22 / 700"],
  ["subtitle", "text-subtitle", "20 / 600"],
  ["row-title", "text-row-title", "20 / 700"],
  ["block-title", "text-block-title", "18 / 700"],
  ["entity-name", "text-entity-name", "17 / 700"],
  ["body", "text-body", "16 / 500"],
  ["nav-active", "text-nav-active", "16 / 600"],
  ["button", "text-button", "16 / 600"],
  ["button-sm", "text-button-sm", "15 / 600"],
  ["caption", "text-caption", "14 / 400"],
  ["caption-strong", "text-caption-strong", "14 / 500"],
  ["meta", "text-meta", "13 / 400"],
  ["meta-medium", "text-meta-medium", "13 / 500"],
  ["meta-strong", "text-meta-strong", "13 / 700"],
  ["nav-icon-label", "text-nav-icon-label", "13 / 600"],
  ["label", "text-label", "12 / 500"],
  ["label-regular", "text-label-regular", "12 / 400"],
  ["micro", "text-micro", "10 / 600"],
] as const;

const RADIUS = [
  ["none", "rounded-none", "0"],
  ["pause", "rounded-pause", "2"],
  ["xs", "rounded-xs", "4"],
  ["social", "rounded-social", "6"],
  ["sm", "rounded-sm", "10"],
  ["md", "rounded-md", "12"],
  ["cta-icon", "rounded-cta-icon", "14"],
  ["row", "rounded-row", "16"],
  ["media", "rounded-media", "18"],
  ["card", "rounded-card", "20"],
  ["sheet", "rounded-sheet", "24"],
  ["pill", "rounded-pill", "999"],
] as const;

const SHADOW = [
  ["card", "shadow-card"],
  ["hover", "shadow-hover"],
] as const;

export default function ShowcaseTokensPage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">디자인 토큰</h1>
      <p className="mt-3 text-caption text-muted">
        .claude/rules/DESIGN.md 기준. 색 34(전시 32 — on-primary·on-media는 둘 다
        흰색이라 제외) · 타이포 26 · radius 12 · 그림자 2
      </p>

      <h2 className="mt-16 text-row-title text-ink">색</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        {COLORS.map(([name, cls]) => (
          <div key={name}>
            <div
              className={`h-20 w-full rounded-media border border-border ${cls}`}
            />
            <p className="mt-2 text-label text-ink">{name}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-row-title text-ink">타이포그래피</h2>
      <div className="mt-6 flex flex-col gap-6">
        {TYPOGRAPHY.map(([name, cls, spec]) => (
          <div key={name} className="flex items-baseline gap-6">
            <span className="w-[120px] shrink-0 text-label text-muted sm:w-[200px]">
              {name}
            </span>
            <span className="hidden w-[80px] shrink-0 text-label text-muted-soft sm:inline">
              {spec}
            </span>
            <span className={`${cls} text-ink`}>다람쥐 헌 쳇바퀴에 타고파</span>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-row-title text-ink">Radius</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        {RADIUS.map(([name, cls, px]) => (
          <div key={name}>
            <div
              className={`h-20 w-full border border-border-strong bg-surface-field ${cls}`}
            />
            <p className="mt-2 text-label text-ink">
              {name} · {px}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-row-title text-ink">Elevation</h2>
      <div className="mt-6 flex flex-wrap gap-10">
        {SHADOW.map(([name, cls]) => (
          <div key={name}>
            <div
              className={`h-20 w-full max-w-[200px] rounded-card bg-surface ${cls}`}
            />
            <p className="mt-2 text-label text-ink">{name}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
