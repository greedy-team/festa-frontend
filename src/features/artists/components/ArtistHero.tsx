// lucide-react 1.x는 브랜드(SNS) 아이콘을 빼서 Instagram 아이콘이 없다 — AtSign으로 대체
import { AtSign } from "lucide-react";
import type { ArtistDetail } from "@/features/artists/types";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { Badge } from "@/components/ui/Badge";

type Props = {
  artist: ArtistDetail;
};

export function ArtistHero({ artist }: Props) {
  const { name, otherNames, genre, instagramUrl } = artist;

  return (
    // 아바타(이니셜+색 정사각 블록)를 뺀다 — 결국 사진 자리를 대신하는 이미지라
    // 목록 행에서 뺀 것과 같은 이유다. 인스타그램 아이콘은 원래 아바타 모서리
    // 배지였는데, 아바타가 없으니 이름 옆으로 옮긴다.
    <div className="flex min-w-0 flex-col gap-3">
      {/* 장르가 비어 있으면(전체의 상당수) 칩 자리를 그리지 않는다 — "미분류" 문구를 새로 만들지 않는다.
          genre는 타입상 ArtistGenre로 좁혀지지만 값은 네트워크에서 오므로, 백엔드가 명세 밖
          값을 내리면 GENRE_LABELS[genre]가 undefined가 될 수 있어 조회 자체를 가드한다. */}
      {genre && GENRE_LABELS[genre] ? (
        <Badge className="w-fit">{GENRE_LABELS[genre]}</Badge>
      ) : null}

      <div className="flex items-center gap-3">
        <h1 className="text-hero text-ink">{name}</h1>
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="flex size-[36px] shrink-0 items-center justify-center rounded-pill border border-border bg-surface text-ink"
          >
            <AtSign size={18} aria-hidden />
          </a>
        ) : null}
      </div>

      {otherNames.length ? (
        <p className="text-caption-strong text-muted">{otherNames.join(" | ")}</p>
      ) : null}
    </div>
  );
}
