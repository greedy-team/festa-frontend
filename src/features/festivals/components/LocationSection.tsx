import type { Location } from "@/features/festivals/types";
import { AdSlot } from "@/components/ui/AdSlot";

type Props = {
  location: Location;
};

export function LocationSection({ location }: Props) {
  const { venueName, address, latitude, longitude } = location;
  // #48(구글 맵 키·결제)이 좌표 기준 길찾기로 확정해뒀다 — place id는 안 쓴다.
  const directionsHref =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : null;

  return (
    <section>
      <h2 className="text-block-title text-ink">오시는 길</h2>
      {/* DEC-0087: 로그인 없는 개인화 영역 대신 광고 하나. 오시는 길과 좌우로 배치한다 */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-card border border-border bg-surface p-6">
          <p className="text-caption-strong text-ink">{venueName}</p>
          {address ? <p className="mt-1 text-caption text-muted">{address}</p> : null}

          {/* 구글 맵 API 키·결제 설정이 아직 없어 폴백 박스로 둔다 (#48) */}
          <div className="mt-4 flex h-[240px] items-center justify-center rounded-md bg-surface-field text-caption text-muted-soft">
            지도 영역 · Google Maps 연동 예정 (#48)
          </div>

          {directionsHref ? (
            <a
              href={directionsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-[44px] items-center justify-center rounded-md border border-border px-6 text-button-sm text-ink"
            >
              길찾기 →
            </a>
          ) : null}
        </div>

        <AdSlot variant="panel" />
      </div>
    </section>
  );
}
