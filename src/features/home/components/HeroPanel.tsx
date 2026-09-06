import Link from "next/link";
import type { UpcomingFestival } from "@/features/home/types";
import { heroTint } from "@/lib/posterTint";
import { dDay, dateRange } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

/** 좌우 분할이 시작되는 브레이크포인트. null이면 항상 세로 스택 (Hero.heroSplitFrom) */
export type HeroSplitFrom = "lg" | "xl" | null;

// 브레이크포인트별 분할 클래스를 리터럴로 다 적어둔다 — 템플릿 문자열로 접두사를
// 붙이면 Tailwind가 빌드 시점에 클래스를 못 찾는다(slideBasisClass와 같은 이유).
//
// container: 세로 스택(flex-col)을 2열 그리드(텍스트 열 | 포스터)로 바꾼다.
//   패널 상단 72는 헤더가 겹치는 자리라 비우고, 나머지 높이의 가운데에 맞춘다.
// text: 스택에서는 display:contents로 D-day와 정보를 컨테이너의 직접 자식으로
//   풀어 order로 포스터를 사이에 끼운다. 분할에서는 실제 열이 돼서 둘을 묶는다.
// poster: 스택에서는 남는 높이를 flex-1로 받고, 분할에서는 그리드 셀 안에서
//   패널 높이의 78%를 차지한다 — 셀은 늘어나지 않아 %가 기준을 잃기 때문에 명시한다.
// name: 1건(전폭)만 축제명을 48로 키운다. 2건은 패널이 반폭이라 30을 유지한다.
const SPLIT = {
  lg: {
    container:
      "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:px-20 lg:pb-0 lg:pt-[72px]",
    text: "lg:flex lg:flex-col lg:items-start",
    info: "lg:mt-8",
    name: "lg:text-hero",
    meta: "lg:text-body",
    cta: "lg:inline-flex",
    poster: "lg:h-[78%] lg:py-0",
  },
  xl: {
    container:
      "xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-10 xl:px-10 xl:pb-0 xl:pt-[72px]",
    text: "xl:flex xl:flex-col xl:items-start",
    info: "xl:mt-8",
    name: "",
    meta: "xl:text-body",
    cta: "xl:inline-flex",
    poster: "xl:h-[62%] xl:py-0",
  },
} as const;

const NONE = {
  container: "",
  text: "",
  info: "",
  name: "",
  meta: "",
  cta: "",
  poster: "",
} as const;

type Props = {
  festival: UpcomingFestival;
  splitFrom?: HeroSplitFrom;
};

export function HeroPanel({ festival, splitFrom = null }: Props) {
  const { festivalId, name, venueName, startDate, endDate, posterUrl, host } =
    festival;
  const split = splitFrom ? SPLIT[splitFrom] : NONE;

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
          그대로 넣고(아래 두 번째 PosterImage), 그러고 남는 자리는 같은 포스터를
          흐리게 깔아 메운다 — 새 색을 만들지 않고 그 축제의 색으로 채우는 방법이다.
          같은 URL이라 브라우저 캐시에 한 번만 받는다.
          scale-110: blur가 가장자리를 투명하게 번지게 해서 틴트가 비치는 것을 막는다 */}
      <PosterImage
        src={posterUrl}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
      />
      {/* 스크림 띠 대신 전면을 한 단계 누른다. 띠는 포스터 하단(날짜·장소가 인쇄된
          자리)을 가로질러 가렸고, 텍스트가 포스터 옆·아래로 빠지면서 받칠 자리가
          없어졌다. 흐린 배경과 원본 포스터의 경계를 잡는 역할도 겸한다. */}
      <div className="absolute inset-0 bg-black/35" />

      {/* 기본은 세로 스택: D-day(상단) → 포스터(남는 높이) → 정보(하단).
          패널이 넓을 때(splitFrom)만 텍스트 열 | 포스터 좌우 분할로 바뀐다.
          흰 글자를 받치는 스크림이 없으므로 그림자를 한 번에 건다 — 밝은
          포스터가 흐려진 배경 위에서도 읽혀야 한다.
          모바일은 스크롤 버튼의 터치 영역·바운스 위로 정보를 띄운다(pb-20). */}
      <div
        className={`relative flex h-full flex-col px-6 pb-20 pt-24 [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:px-10 sm:pb-14 sm:pt-[140px] ${split.container}`}
      >
        <div className={`contents ${split.text}`}>
          {/* 56/700 흰색 100%. 패널이 헤더 아래까지 올라와 있어서(Hero.tsx)
              시안의 프레임 좌표 y140을 그대로 쓴다 — 헤더 72 + 인셋 68 */}
          <p className="order-1 text-hero-dday text-on-media">{dDay(startDate)}</p>

          {/* 위계는 흰색 불투명도로만 낸다. 한 줄에 몰아넣지 않고 항목마다 줄을
              나눠서, 학교명·축제명·장소명 중 어느 하나가 길어져도 다른 항목을
              밀거나 겹치지 않게 한다. */}
          <div className={`order-3 flex flex-col gap-2 ${split.info}`}>
            <span className="truncate text-caption-strong text-on-media/75">
              {host.name}
            </span>
            <h2
              className={`line-clamp-2 break-keep text-hero-name text-on-media ${split.name}`}
            >
              {name}
            </h2>
            <p className={`truncate text-caption-strong text-on-media/85 ${split.meta}`}>
              {dateRange(startDate, endDate)}
            </p>
            <p className={`truncate text-caption-strong text-on-media/85 ${split.meta}`}>
              {venueName}
            </p>
            {/* 넓은 패널에서만 보이는 CTA. 스택에서는 칸 전체가 링크라 따로 두지
                않는다. 흰 채움 + ink — 히어로 안에 인디고를 넣지 않는다(DESIGN.md).
                텍스트 그림자는 흰 버튼 안에서 번지므로 여기서만 끈다 */}
            <span
              className={`mt-6 hidden h-[48px] items-center self-start rounded-md bg-surface px-6 text-button text-ink [text-shadow:none] ${split.cta}`}
            >
              자세히 보기 →
            </span>
          </div>
        </div>

        {/* 원본 비율. 스택에서는 D-day와 정보 사이 남는 높이를 차지하고, 그 안에서
            가운데 정렬된다. min-h-0: flex 자식은 기본 min-height가 auto라
            내용(포스터 원본 높이)보다 작아지지 못하고 삐져나간다 */}
        <div
          className={`order-2 flex min-h-0 flex-1 items-center justify-center py-6 ${split.poster}`}
        >
          <PosterImage
            src={posterUrl}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </Link>
  );
}
