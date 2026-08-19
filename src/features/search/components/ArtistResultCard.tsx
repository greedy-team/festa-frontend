import Link from "next/link";
import type { ArtistResult } from "@/features/search/types";
import { gridTint } from "@/lib/posterTint";
import { fullDate } from "@/lib/festivalDate";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  artist: ArtistResult;
};

/**
 * 시안엔 Verified 배지·참여 학교 통계·별칭 배지도 있지만 뺐다 — /search 응답에
 * 대응 데이터가 없고 DESIGN.md 컴포넌트 시트에도 없는 미확정 요소다 (#53).
 */
export function ArtistResultCard({ artist }: Props) {
  const { artistId, name, imageUrl, appearanceCount, latestAppearanceDate } = artist;

  return (
    <div className="flex items-center gap-6 rounded-card border border-border bg-surface p-6">
      <div
        className={`relative size-[88px] shrink-0 overflow-hidden rounded-pill ${gridTint(artistId)}`}
      >
        <PosterImage
          src={imageUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-row-title text-ink">{name}</h3>
        <p className="mt-1 text-caption-strong text-muted">출연 {appearanceCount}회</p>
        <p className="mt-1 text-caption-strong text-muted-soft">
          {latestAppearanceDate
            ? `최근 출연 · ${fullDate(latestAppearanceDate)}`
            : "출연 기록 없음"}
        </p>
      </div>

      {/* 상세 화면(DESIGN.md 09 Artist Detail)이 아직 없어 임시로 홈에 연결한다 (#53). */}
      <Link
        href="/"
        className="flex h-[40px] shrink-0 items-center justify-center rounded-md border border-border px-6 text-button-sm text-ink"
      >
        프로필 보기
      </Link>
    </div>
  );
}
