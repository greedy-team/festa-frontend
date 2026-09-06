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
        <div>
          {mapSrc ? (
            <iframe
              title={venueName ? `${venueName} 위치 지도` : "축제 위치 지도"}
              src={mapSrc}
              loading="lazy"
              className="h-[280px] w-full rounded-card border-0 sm:h-[360px]"
            />
          ) : (
            // 좌표가 없거나 키가 없는 환경(키 없이 도는 로컬)에서만 남는 자리다.
            <div className="flex h-[280px] items-center justify-center rounded-card bg-surface-field text-caption text-muted-soft sm:h-[360px]">
              지도 준비 중입니다
            </div>
          )}

          {venueName || address || directionsHref ? (
            <div className="mt-4 flex min-h-[44px] flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              {venueName || address ? (
                <div className="min-w-0">
                  {venueName ? <p className="text-body text-ink">{venueName}</p> : null}
                  {address ? <p className="mt-1 text-caption text-muted">{address}</p> : null}
                </div>
              ) : null}

              {directionsHref ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 items-center text-button-sm text-ink underline-offset-4 hover:underline"
                >
                  Google 지도에서 길찾기 →
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <AdSlot variant="panel" />
      </div>
    </section>
  );
}
