import Link from "next/link";
import type { ArtistResult } from "@/features/search/types";
import { fullDate } from "@/lib/festivalDate";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";

type Props = {
  artist: ArtistResult;
};

/**
 * 시안엔 Verified 배지·참여 학교 통계·별칭 배지도 있지만 뺐다 — /search 응답에
 * 대응 데이터가 없고 DESIGN.md 컴포넌트 시트에도 없는 미확정 요소다 (#53).
 */
export function ArtistResultCard({ artist }: Props) {
  const { artistId, name, appearanceCount, latestAppearanceDate } = artist;

  return (
    <div className="flex items-center gap-6 rounded-card border border-border bg-surface p-6">
      <ArtistAvatar name={name} size={88} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-row-title text-ink">{name}</h3>
        <p className="mt-1 text-caption-strong text-muted">출연 {appearanceCount}회</p>
        <p className="mt-1 text-caption-strong text-muted-soft">
          {latestAppearanceDate
            ? `최근 출연 · ${fullDate(latestAppearanceDate)}`
            : "출연 기록 없음"}
        </p>
      </div>

      <Link
        href={`/artists/${artistId}`}
        className="flex h-[40px] shrink-0 items-center justify-center rounded-md border border-border px-6 text-button-sm text-ink"
      >
        프로필 보기
      </Link>
    </div>
  );
}
