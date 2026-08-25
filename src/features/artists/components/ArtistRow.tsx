import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Artist } from "@/features/artists/types";
import { genreLabel } from "@/lib/artistGenre";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";

type Props = {
  artist: Artist;
};

/**
 * 아티스트 목록의 행 표시. 실사진을 안 쓰는 아티스트(DEC-0063)는 카드 그리드로
 * 키워봤자 이니셜 원 하나뿐이라 정보 밀도가 낮다 — 검색 결과의 행 패턴
 * (SchoolResultRow)을 그대로 가져와 많은 아티스트를 한눈에 훑을 수 있게 한다.
 */
export function ArtistRow({ artist }: Props) {
  const { artistId, name, genre, appearanceCount, recentFestival } = artist;

  return (
    <Link
      href={`/artists/${artistId}`}
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
      <ArtistAvatar name={name} size={56} shape="circle" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-subtitle text-ink">{name}</h3>
        <p className="mt-1 truncate text-caption-strong text-muted">
          {genreLabel(genre)} · 출연 {appearanceCount}회
          {recentFestival
            ? ` · 최근 ${recentFestival.hostShortName} ${recentFestival.name}`
            : ""}
        </p>
      </div>

      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
