import Link from "next/link";
import { AtSign, Calendar, Globe, MapPin, Ticket } from "lucide-react";
import type { FestivalDetail } from "@/features/festivals/types";
import { heroTint } from "@/lib/posterTint";
import { dateRange, formatDday, festivalStatus } from "@/lib/festivalDate";
import { ticketTypeLabel } from "@/lib/admission";
import { safeHttpUrl } from "@/lib/safeUrl";
import { PosterImage } from "@/components/ui/PosterImage";
import { Badge } from "@/components/ui/Badge";

type Props = {
  festival: FestivalDetail;
};

export function FestivalHero({ festival }: Props) {
  const {
    id,
    name,
    host,
    startDate,
    endDate,
    dday,
    posterUrl,
    location,
    admission,
  } = festival;
  const status = festivalStatus(startDate, endDate);
  // 관리자 등록 API가 URL 형식을 검사하지 않는다 (DEC-0107) — http(s)가 아니면 링크로 그리지 않는다
  const safeInstagramUrl = host.instagramUrl ? safeHttpUrl(host.instagramUrl) : null;
  const safeHomepageUrl = host.homepageUrl ? safeHttpUrl(host.homepageUrl) : null;

  return (
    <div
      className={`relative flex min-h-[400px] flex-col overflow-hidden rounded-card ${heroTint(id)}`}
    >
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 상세 화면 카드 스크림 3단 중 가장 진한 단계 — 텍스트가 항상 위에 있어야 한다 */}
      <div className="absolute inset-0 bg-scrim-35" />

      {/* 시안(08-2) 우상단 아이콘 — 주최의 인스타그램·공식 사이트 링크. 없으면 그리지 않는다.
          z-20인 이유: 아래 본문 블록이 flex-1로 카드 전체를 덮는데 그쪽도 z-10이라,
          같은 값이면 DOM에서 뒤에 있는 본문이 히트 테스트를 이겨 이 링크가 눌리지
          않는다(본문 첫 줄인 뱃지 행이 가로폭을 다 차지해 이 자리를 먹는다).
          ISS-0070에서 홈 히어로 링크가 도트 래퍼에 가려졌던 것과 같은 유형이다. */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        {safeInstagramUrl ? (
          <a
            href={safeInstagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="주최 인스타그램"
            className="flex size-[40px] items-center justify-center rounded-pill bg-white/20 text-on-media"
          >
            <AtSign size={18} aria-hidden />
          </a>
        ) : null}
        {safeHomepageUrl ? (
          <a
            href={safeHomepageUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="주최 공식 사이트"
            className="flex size-[40px] items-center justify-center rounded-pill bg-white/20 text-on-media"
          >
            <Globe size={18} aria-hidden />
          </a>
        ) : null}
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-6 p-8">
        <div className="flex items-center gap-2">
          <Badge>{formatDday(dday)}</Badge>
          {/* 진행중(success)만 정의된 상태 색이 있다 — 예정·종료는 D-day 텍스트로 충분해 배지를 더 만들지 않는다 */}
          {status === "ONGOING" ? <Badge variant="success">진행중</Badge> : null}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-hero text-on-media">{name}</h1>

          <div className="flex flex-col gap-2 text-caption-strong text-on-media/85">
            <p className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0" aria-hidden />
              {dateRange(startDate, endDate)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" aria-hidden />
              {location.venueName}
            </p>
            <p className="flex items-center gap-2">
              <Ticket size={14} className="shrink-0" aria-hidden />
              {ticketTypeLabel(admission.ticketType)}
            </p>
          </div>

          <Link
            href={`/hosts/${host.id}`}
            className="inline-flex w-fit items-center gap-1 rounded-pill bg-white/20 px-4 py-2 text-caption-strong text-on-media"
          >
            주최 · {host.name} ›
          </Link>
        </div>
      </div>
    </div>
  );
}
