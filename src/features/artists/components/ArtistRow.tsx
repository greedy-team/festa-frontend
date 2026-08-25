import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Artist } from "@/features/artists/types";
import { genreLabel } from "@/lib/artistGenre";

type Props = {
  artist: Artist;
};

/**
 * 아티스트 목록의 행 표시. 실사진을 안 쓰는 아티스트(DEC-0063)는 카드 그리드로
 * 키워봤자 이니셜 원 하나뿐이라 정보 밀도가 낮다 — 많은 아티스트를 한눈에
 * 훑을 수 있게 행으로 나열한다. 개별 테두리·좌우 패딩을 넣으면 텍스트가 위
 * 제목("아티스트")보다 안쪽으로 밀려 보인다 — 상자로 감싸지 않고 구분선만
 * 그어서(부모의 divide-y) 윈도우 탐색기 자세히보기처럼 텍스트가 그대로
 * 흐르게 한다.
 */
export function ArtistRow({ artist }: Props) {
  const { artistId, name, genre, appearanceCount, recentFestival } = artist;

  return (
    <Link
      href={`/artists/${artistId}`}
      className="flex items-center gap-4 py-4 transition-colors hover:bg-surface-field"
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
