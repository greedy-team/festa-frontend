import Link from "next/link";
import type { UpcomingHostFestival } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { dateRange, formatDday } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";
import { Badge } from "@/components/ui/Badge";

type Props = {
  festival: UpcomingHostFestival;
};

/** upcoming-host-card (DESIGN.md) — 포스터 전면형 + 3단 스크림 */
export function UpcomingFestivalCard({ festival }: Props) {
  const { festivalId, name, posterUrl, startDate, endDate, dday } = festival;

  return (
    <Link
      href={`/festivals/${festivalId}`}
      // 포스터 전면형이라 예정 공연 카드(upcoming-show-card)와 같은 hover를 준다.
      // 이 카드는 Link 자체가 포스터 컨테이너라 스케일을 Link에 직접 건다.
      // 큰 카드(356px)라 5% 확대는 캐러셀 폭을 넘겨 — 3%로 낮춘다.
      className={`relative flex h-[372px] w-[356px] max-w-full flex-col justify-end overflow-hidden rounded-card transition-transform duration-300 hover:scale-[1.03] hover:shadow-hover motion-reduce:transition-none motion-reduce:hover:scale-100 ${gridTint(festivalId)}`}
    >
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-scrim-35 via-scrim-30 to-scrim-25" />

      {/* 응답의 dday는 endDate >= today인 축제만 내려온다 — 0 이하는 지난 게 아니라 진행중이다 */}
      <Badge variant="on-media" className="absolute right-4 top-4">
        {dday > 0 ? formatDday(dday) : "진행중"}
      </Badge>

      <div className="relative z-10 flex flex-col gap-1 p-6">
        <h3 className="text-card-title text-on-media">{name}</h3>
        <p className="text-caption-strong text-on-media/85">
          {dateRange(startDate, endDate)}
        </p>
        <span className="mt-2 text-caption-strong text-on-media">자세히 보기 →</span>
      </div>
    </Link>
  );
}
