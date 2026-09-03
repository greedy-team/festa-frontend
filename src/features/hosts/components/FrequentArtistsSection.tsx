import Link from "next/link";
import type { FrequentArtist } from "@/features/hosts/types";
import { Badge } from "@/components/ui/Badge";

type Props = {
  artists: FrequentArtist[];
};

export function FrequentArtistsSection({ artists }: Props) {
  if (!artists.length) return null;

  return (
    <section>
      <h2 className="text-block-title text-ink">이 학교에 자주 온 아티스트</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {artists.map((artist) => (
          <Link
            key={artist.artistId}
            href={`/artists/${artist.artistId}`}
            className="flex flex-col items-start gap-2 rounded-card border border-border bg-surface p-5 transition-shadow duration-300 hover:shadow-hover motion-reduce:transition-none"
          >
            <span className="text-meta-medium text-muted-soft">
              {String(artist.rank).padStart(2, "0")}
            </span>
            {/* 아바타 자리 없음 — 실사진은 초상권 때문에 쓰지 않고(DEC-0063),
                빈 자리를 색 블록으로 채우지도 않는다(DEC-0130). 순위·이름·출연
                횟수만 남는다 */}
            <h3 className="text-entity-name text-ink">{artist.name}</h3>
            <Badge>{artist.appearanceCount}회 출연</Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
