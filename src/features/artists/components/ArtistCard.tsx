import Link from "next/link";
import type { Artist } from "@/features/artists/types";
import { genreLabel } from "@/lib/artistGenre";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";

type Props = {
  artist: Artist;
};

export function ArtistCard({ artist }: Props) {
  const { artistId, name, genre, appearanceCount, recentFestival } = artist;

  return (
    <Link href={`/artists/${artistId}`} className="flex flex-col">
      {/* 정사각 236:236 — artist-card 스펙 (festival-card는 236:320 포스터) */}
      <ArtistAvatar name={name} size={236} shape="square" />

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
