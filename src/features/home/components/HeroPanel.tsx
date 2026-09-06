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
      // 포커스 링은 사이트 기본이 인디고(globals.css)지만, 이 링크는 포스터 이미지
      // 전체에 겹쳐 있어 DESIGN.md("히어로 안에 인디고를 넣지 않는다")에 따라
      // 흰색으로 예외를 둔다. 패널끼리 여백 없이 맞닿아 있어(DESIGN.md) 기본
      // outline-offset(2px)을 그대로 쓰면 옆 패널을 침범해 안쪽으로 당긴다.
      // 슬라이드 폭이 소수점이면 이동 중 흰 바탕이 비칠 수 있어, 그림만 1px 겹친다.
      // 바깥 슬라이드 폭은 유지하므로 캐러셀의 이동 거리에는 영향을 주지 않는다.
      className={`relative block h-full w-[calc(100%+1px)] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-on-media ${heroTint(festivalId)}`}
    >
      {/* 포스터를 잘라서 채우면 제목·핵심 그래픽이 화면 밖으로 나간다. 원본 비율
          그대로 넣고(아래 두 번째 PosterImage), 그러고 남는 위아래(또는 좌우)는
          같은 포스터를 흐리게 깔아 메운다 — 새 색을 만들지 않고 그 축제의 색으로
          채우는 방법이다. 같은 URL이라 브라우저 캐시에 한 번만 받는다.
          scale-110: blur가 가장자리를 투명하게 번지게 해서 틴트가 비치는 것을 막는다 */}
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
      />
      {/* 흐린 배경이 그대로 밝으면 위에 얹는 원본 포스터의 테두리가 안 잡힌다 */}
      <div className="absolute inset-0 bg-black/10" />

      {/* 원본 비율. m-auto가 남는 축(가로든 세로든) 양쪽에 여백을 똑같이 나눈다 */}
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 m-auto max-h-[84%] max-w-full object-contain"
      />

      {/* 하단 스크림 — 순검정 55% 단일 단계. 그라데이션이 아니다 */}
      <div className="absolute inset-x-0 bottom-0 h-[240px] bg-scrim-hero" />

      {/* D-day는 스크림 밖 상단이라 받쳐주는 게 없다 — 밝은 포스터에서 흰 글자가
          묻히므로 그림자로 대비를 만든다. 배경을 더 어둡게 눌러 해결하지 않는 이유는
          배경 포스터가 무엇인지 보여야 하기 때문이다.
          56/700 흰색 100%. 패널이 헤더 아래까지 올라와 있어서(Hero.tsx)
          시안의 프레임 좌표 y140을 그대로 쓴다 — 헤더 72 + 인셋 68 */}
      <p className="absolute left-6 top-24 text-hero-dday text-on-media [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:left-10 sm:top-[140px]">
        {dDay(startDate)}
      </p>

      {/* 정보는 스크림 안 하단. 위계는 흰색 불투명도로만 낸다.
          한 줄에 몰아넣지 않고 항목마다 줄을 나눠서, 학교명·축제명·장소명 중
          어느 하나가 길어져도 다른 항목을 밀거나 겹치지 않게 한다.
          여기엔 그림자를 안 준다 — 스크림이 이미 받치고 있어 겹쳐봐야 안 보인다. */}
      {/* 모바일은 스크롤 버튼의 터치 영역·바운스 위로 정보를 띄운다. */}
      <div className="absolute inset-x-6 bottom-20 flex flex-col gap-2 sm:inset-x-10 sm:bottom-14">
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
