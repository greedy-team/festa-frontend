import type { HostDetail } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  host: HostDetail;
};

/** host.type은 쓰지 않는다 — 확정된 ERD에 없는 필드다 (#46) */
export function HostHero({ host }: Props) {
  const { id, name, shortName, region, logoUrl, bannerUrl } = host;

  return (
    <div
      className={`relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-card p-8 ${gridTint(id)}`}
    >
      <PosterImage
        src={bannerUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-scrim-35" />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`relative size-[64px] shrink-0 overflow-hidden rounded-pill border border-on-media/30 ${gridTint(id)}`}
        >
          <PosterImage
            src={logoUrl}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-caption-strong text-on-media/85">
            {shortName} · {region}
          </p>
          <h1 className="mt-1 text-hero text-on-media">{name}</h1>
        </div>
      </div>
    </div>
  );
}
