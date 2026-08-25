import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Artist } from "@/features/artists/types";
import { genreLabel } from "@/lib/artistGenre";

type Props = {
  artist: Artist;
};

/**
 * 아티스트 목록의 행 표시. 실사진을 안 쓰는 아티스트(DEC-0063)는 카드 그리드로
 * 키워봤자 이니셜 원 하나뿐이라 정보 밀도가 낮다 — 검색 결과의 행 패턴
 * (SchoolResultRow)을 그대로 가져와 많은 아티스트를 한눈에 훑을 수 있게 한다.
 * 아바타도 결국 사진 자리를 대신하는 이미지라, 텍스트만으로 훑는 목록에서는
 * 아예 빼고 이름·메타 텍스트만 남긴다.
 */
export function ArtistRow({ artist }: Props) {
  const { artistId, name, genre, appearanceCount, recentFestival } = artist;

  return (
    <Link
      href={`/artists/${artistId}`}
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
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
