import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ArtistResult } from "@/features/search/types";
import { fullDate } from "@/lib/festivalDate";

type Props = {
  artist: ArtistResult;
};

/**
 * 시안엔 Verified 배지·참여 학교 통계·별칭 배지도 있지만 뺐다 — /search 응답에
 * 대응 데이터가 없고 DESIGN.md 컴포넌트 시트에도 없는 미확정 요소다 (#53).
 *
 * 이니셜+색 아바타(ArtistAvatar)도 뺐다 — 사진이 없는 자리를 색으로 채우지 않는다
 * (DEC-0130). 아티스트 히어로·목록이 이미 걷어낸 판정을 검색 결과에도 맞춘다.
 * 같은 화면의 학교·축제와 같은 행 형태로 통일해 이름·메타만 텍스트로 보여준다 (#153).
 */
export function ArtistResultRow({ artist }: Props) {
  const { artistId, name, appearanceCount, latestAppearanceDate } = artist;

  return (
    <Link
      href={`/artists/${artistId}`}
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-4 py-4 sm:px-6"
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-subtitle text-ink">{name}</h3>
        <p className="mt-1 text-caption-strong text-muted">
          출연 {appearanceCount}회
          {latestAppearanceDate
            ? ` · 최근 출연 ${fullDate(latestAppearanceDate)}`
            : ""}
        </p>
      </div>

      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
