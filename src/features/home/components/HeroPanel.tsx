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
    // 패널 전체가 축제 상세로 가는 링크다 — "자세히 보기" 텍스트 대신 칸 전체가
    // 그 어포던스를 대신한다. 틴트를 먼저 깔고 이미지를 그 위에 얹는다. 이미지가
    // 없거나 로드에 실패해도 밑의 틴트가 그대로 보인다 (스펙 3.2).
    <Link
      href={`/festivals/${festivalId}`}
      className={`relative block h-full w-full overflow-hidden ${heroTint(festivalId)}`}
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

      {/* 정보는 스크림 안 하단. 위계는 흰색 불투명도로만 낸다.
          한 줄에 몰아넣지 않고 항목마다 줄을 나눠서, 학교명·축제명·장소명 중
          어느 하나가 길어져도 다른 항목을 밀거나 겹치지 않게 한다. */}
      <div className="absolute inset-x-10 bottom-14 flex flex-col gap-2">
        <span className="truncate text-caption-strong text-on-media/75">
          {host.name}
        </span>
        <h2 className="line-clamp-2 text-hero-name text-on-media">{name}</h2>
        <p className="truncate text-caption-strong text-on-media/85">
          {dateRange(startDate, endDate)}
        </p>
        <p className="truncate text-caption-strong text-on-media/85">
          {venueName}
        </p>
      </div>
    </Link>
  );
}
