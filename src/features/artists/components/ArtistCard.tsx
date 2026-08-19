import Link from "next/link";
import type { Artist } from "@/features/artists/types";
import { gridTint } from "@/lib/posterTint";
import { genreLabel } from "@/lib/artistGenre";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  artist: Artist;
};

export function ArtistCard({ artist }: Props) {
  const { artistId, name, imageUrl, genre, appearanceCount, recentFestival } =
    artist;

  return (
    // 상세 화면(DESIGN.md 09 Artist Detail)이 아직 없어 임시로 홈에 연결한다 (#49).
    <Link href="/" className="flex flex-col">
      {/* 정사각 236:236 — artist-card 스펙 (festival-card는 236:320 포스터).
          imageUrl은 항상 null이다 (DEC-0063) — PosterImage가 아무것도 안 그리고 틴트만 남는다. */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-media ${gridTint(artistId)}`}
      >
        <PosterImage
          src={imageUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <h3 className="mt-4 truncate text-entity-name text-ink">{name}</h3>
      <span className="mt-1 truncate text-label-regular text-muted">
        {genreLabel(genre)} · 출연 {appearanceCount}회
      </span>
      <span className="mt-1 truncate text-label-regular text-muted-soft">
        {recentFestival
          ? `최근 · ${recentFestival.hostShortName} ${recentFestival.name}`
          : "출연 기록 없음"}
      </span>
    </Link>
  );
}
