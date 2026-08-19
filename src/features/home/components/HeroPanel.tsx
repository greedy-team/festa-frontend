import Link from "next/link";
import type { UpcomingFestival } from "@/features/home/types";
import { heroTint } from "@/lib/posterTint";
import { dDay, dateRange } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  festival: UpcomingFestival;
};

export function HeroPanel({ festival }: Props) {
  const { festivalId, name, venueName, startDate, endDate, posterUrl, host } =
    festival;

  return (
    // 틴트를 먼저 깔고 이미지를 그 위에 얹는다. 이미지가 없거나 로드에
    // 실패해도 밑의 틴트가 그대로 보인다 (스펙 3.2).
    <div
      className={`relative h-full w-full overflow-hidden ${heroTint(festivalId)}`}
    >
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 하단 스크림 — 순검정 55% 단일 단계. 그라데이션이 아니다 */}
      <div className="absolute inset-x-0 bottom-0 h-[364px] bg-scrim-hero" />

      {/* D-day는 스크림 밖 상단. 56/700 흰색 100% */}
      <p className="absolute left-10 top-[68px] text-hero-dday text-on-media">
        {dDay(startDate)}
      </p>

      {/* 정보는 스크림 안 하단. 위계는 흰색 불투명도로만 낸다 */}
      <div className="absolute inset-x-10 bottom-14 flex flex-col gap-2">
        <span className="truncate text-caption-strong text-on-media/75">
          {host.name}
        </span>
        <h2 className="text-hero-name text-on-media">{name}</h2>
        <p className="text-caption-strong text-on-media/85">
          {dateRange(startDate, endDate)}
          <span className="ml-4">{venueName}</span>
        </p>
        {/* 상세 화면이 아직 없다 (DESIGN.md Known Gaps: 히어로 카드 클릭 인터랙션 미정).
            링크 자체는 06-D에 있는 요소라 그리고, 목적지가 정해질 때까지 홈으로 보낸다. */}
        <Link href="/" className="text-caption-strong text-on-media">
          자세히 보기 →
        </Link>
      </div>
    </div>
  );
}
