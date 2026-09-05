import type { Location } from "@/features/festivals/types";
import { AdSlot } from "@/components/ui/AdSlot";

type Props = {
  location: Location;
};

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export function LocationSection({ location }: Props) {
  const { venueName, address, latitude, longitude } = location;
  const hasCoordinates = latitude != null && longitude != null;
  // DEC-0072: 길찾기도 지도도 좌표 하나만 쓴다 — place id는 두지 않는다.
  const directionsHref = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : null;
  // DEC-0035: 렌더 전용이라 JS SDK 없이 Embed API iframe으로 충분하다.
  const mapSrc =
    hasCoordinates && MAPS_KEY
      ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${latitude},${longitude}`
      : null;

  return (
    <section>
      <h2 className="text-block-title text-ink">오시는 길</h2>
      {/* DEC-0087: 로그인 없는 개인화 영역 대신 광고 하나. 오시는 길과 좌우로 배치한다 */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-card border border-border bg-surface p-6">
          <p className="text-body text-ink">{venueName}</p>
          {address ? <p className="mt-1 text-caption text-muted">{address}</p> : null}

          {mapSrc ? (
            <iframe
              title={`${venueName} 위치 지도`}
              src={mapSrc}
              loading="lazy"
              className="mt-4 h-[240px] w-full rounded-md border-0"
            />
          ) : (
            // 좌표가 없거나 키가 없는 환경(키 없이 도는 로컬)에서만 남는 자리다.
            <div className="mt-4 flex h-[240px] items-center justify-center rounded-md bg-surface-field text-caption text-muted-soft">
              지도 준비 중입니다
            </div>
          )}

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
