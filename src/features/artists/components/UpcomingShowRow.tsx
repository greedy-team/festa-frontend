import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import type { UpcomingShow } from "@/features/artists/types";
import { gridTint } from "@/lib/posterTint";
import { fullDate, formatDday } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";
import { Badge } from "@/components/ui/Badge";

type Props = {
  show: UpcomingShow;
};

export function UpcomingShowRow({ show }: Props) {
  const { festivalId, name, hostName, venueName, posterUrl, performanceDate, day, dday } =
    show;

  return (
    // 상자로 감싸지 않고 부모의 divide-y 구분선만으로 나눈다(아티스트 목록
    // 행과 같은 이유) — 포스터는 축제 이미지라 남기고, 테두리·좌우 패딩만 뺀다
    <Link
      href={`/festivals/${festivalId}`}
      className="flex items-center gap-4 py-4"
    >
      <div
        className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-media ${gridTint(festivalId)}`}
      >
        <PosterImage
          src={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-entity-name text-ink">{name}</h3>
        {/* 날짜(언제)와 장소(어디서)를 한 줄에 몰아넣으면 정보 4종류가 섞여 스캔하기
            어렵고, 좁은 화면에서는 장소가 줄임표 뒤로 통째로 잘려 안 보인다 — 성격별로
            두 줄로 나눈다. D-day가 공연일(performanceDate) 기준이라, 옆 날짜도 축제
            전체 기간이 아니라 실제 공연일을 보여준다. */}
        <p className="mt-1 flex items-center gap-1.5 text-caption-strong text-muted">
          <Calendar size={14} className="shrink-0" aria-hidden />
          <span className="truncate">
            DAY {day} · {fullDate(performanceDate)}
          </span>
        </p>
        <p className="mt-0.5 truncate text-label-regular text-muted-soft">
          {hostName} · {venueName}
        </p>
      </div>

      <Badge className="shrink-0">{formatDday(dday)}</Badge>
      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
