import Link from "next/link";
import type { FrequentArtist } from "@/features/hosts/types";
import { gridTint } from "@/lib/posterTint";
import { PosterImage } from "@/components/ui/PosterImage";

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
          // 아티스트 상세(#47)가 아직 없어 임시로 홈에 연결한다
          <Link
            key={artist.artistId}
            href="/"
            className="flex flex-col items-start gap-2 rounded-card border border-border bg-surface p-5"
          >
            <span className="text-meta-medium text-muted-soft">
              {String(artist.rank).padStart(2, "0")}
            </span>
            <div
              className={`size-[64px] overflow-hidden rounded-pill ${gridTint(artist.artistId)}`}
            >
              <PosterImage
                src={artist.imageUrl}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-entity-name text-ink">{artist.name}</h3>
            <span className="rounded-pill bg-primary-soft px-2 py-0.5 text-label text-primary">
              {artist.appearanceCount}회 출연
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
