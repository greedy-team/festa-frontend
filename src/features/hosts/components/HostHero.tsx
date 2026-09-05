import { Globe } from "lucide-react";
import type { HostDetail } from "@/features/hosts/types";
import { safeHttpUrl } from "@/lib/safeUrl";

type Props = {
  host: HostDetail;
};

// 로고·배너 자리를 그리지 않는다. 둘은 호스팅 주체가 미결이라 값이 실제로 없고
// (DEC-0093), 빈 자리를 색 블록으로 채우지도 않는다 (DEC-0130) — 채우면 빈자리가
// 해결되는 게 아니라 빈자리처럼 보인다. 값이 없는 자리는 비활성이 아니라 제거다
// (DEC-0129). 아티스트 상세와 같은 문법으로 흰 배경 위 타이포만으로 위계를 낸다.
//
// 복구 지점: logoUrl·bannerUrl에 값이 생기면 여기에 로고와 배너를 다시 넣는다.
// 응답 필드와 관리자 등록 화면의 입력 항목은 그대로 살아 있다.
//
// host.type은 쓰지 않는다 — 확정된 ERD에 없는 필드다 (#46)
export function HostHero({ host }: Props) {
  const { name, shortName, region, homepageUrl } = host;
  // 관리자 등록 API가 URL 형식을 검사하지 않아 깨진/악성 값이 그대로 내려올 수 있다
  // (DEC-0107). http(s)가 아니면 링크로 그리지 않는다.
  const safeHomepageUrl = homepageUrl ? safeHttpUrl(homepageUrl) : null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="text-caption-strong text-muted">
        {shortName} · {region}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-hero text-ink">{name}</h1>
        {/* 공식 사이트가 없으면 자리를 그리지 않는다. 인스타그램은 이 응답 계약에
            없어 자리를 만들지 않는다 (DEC-0107) */}
        {safeHomepageUrl ? (
          <a
            href={safeHomepageUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="주최 공식 사이트"
            className="flex size-[36px] shrink-0 items-center justify-center rounded-pill border border-border bg-surface text-ink"
          >
            <Globe size={18} aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}
