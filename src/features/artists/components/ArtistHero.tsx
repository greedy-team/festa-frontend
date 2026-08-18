// lucide-react 1.x는 브랜드(SNS) 아이콘을 빼서 Instagram 아이콘이 없다 — AtSign으로 대체
import { AtSign } from "lucide-react";
import type { ArtistDetail } from "@/features/artists/types";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { Badge } from "@/components/ui/Badge";

type Props = {
  artist: ArtistDetail;
};

export function ArtistHero({ artist }: Props) {
  const { name, otherNames, genre, instagramUrl } = artist;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <ArtistAvatar name={name} size={160} shape="square" />

      <div className="flex flex-col gap-3">
        {/* 장르가 비어 있으면(전체의 상당수) 칩 자리를 그리지 않는다 — "미분류" 문구를 새로 만들지 않는다 */}
        {genre ? <Badge className="w-fit">{GENRE_LABELS[genre]}</Badge> : null}

        <div className="flex items-center gap-2">
          <h1 className="text-hero text-ink">{name}</h1>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="인스타그램"
              className="text-muted"
            >
              <AtSign size={20} aria-hidden />
            </a>
          ) : null}
        </div>

        {otherNames.length ? (
          <p className="text-caption-strong text-muted">{otherNames.join(" | ")}</p>
        ) : null}
      </div>
    </div>
  );
}
