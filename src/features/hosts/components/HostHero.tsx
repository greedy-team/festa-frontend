import { Globe } from "lucide-react";
import type { HostDetail } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { safeHttpUrl } from "@/lib/safeUrl";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  host: HostDetail;
};

/** host.type은 쓰지 않는다 — 확정된 ERD에 없는 필드다 (#46) */
export function HostHero({ host }: Props) {
  const { id, name, shortName, region, logoUrl, bannerUrl, homepageUrl } = host;
  // 관리자 등록 API가 URL 형식을 검사하지 않아 깨진/악성 값이 그대로 내려올 수 있다
  // (DEC-0107). http(s)가 아니면 링크로 그리지 않는다.
  const safeHomepageUrl = homepageUrl ? safeHttpUrl(homepageUrl) : null;

  return (
    <div
      className={`relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-card p-8 ${gridTint(id)}`}
    >
      <PosterImage
        src={bannerUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-scrim-35" />

      {/* 우상단 공식 사이트 링크 — 축제 상세 히어로와 같은 패턴. 없으면 그리지 않는다.
          인스타그램은 이 응답 계약에 없어 자리를 만들지 않는다 (DEC-0107) */}
      {safeHomepageUrl ? (
        <a
          href={safeHomepageUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="주최 공식 사이트"
          className="absolute right-6 top-6 z-10 flex size-[40px] items-center justify-center rounded-pill bg-white/20 text-on-media"
        >
          <Globe size={18} aria-hidden />
        </a>
      ) : null}

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
