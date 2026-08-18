import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import type { FestivalDetail } from "@/features/festivals/types";
import { heroTint } from "@/lib/posterTint";
import { dateRange, dDay, festivalStatus } from "@/lib/festivalDate";
import { TICKET_TYPE_LABELS } from "@/lib/admission";
import { PosterImage } from "@/components/ui/PosterImage";
import { Badge } from "@/components/ui/Badge";

type Props = {
  festival: FestivalDetail;
};

export function FestivalHero({ festival }: Props) {
  const { id, name, host, startDate, endDate, posterUrl, location, admission } =
    festival;
  const status = festivalStatus(startDate, endDate);

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

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-6 p-8">
        <div className="flex items-center gap-2">
          <Badge>{dDay(startDate)}</Badge>
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
              {TICKET_TYPE_LABELS[admission.ticketType]}
            </p>
          </div>

          {/* 주최 상세(DESIGN.md 10 School Detail, #46)가 아직 없어 임시로 홈에 연결한다 */}
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1 rounded-pill bg-white/20 px-4 py-2 text-caption-strong text-on-media"
          >
            주최 · {host.name} ›
          </Link>
        </div>
      </div>
    </div>
  );
}
