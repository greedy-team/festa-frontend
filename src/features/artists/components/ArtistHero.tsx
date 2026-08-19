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
      {/* 시안(09-2)은 인스타그램 아이콘이 아바타 사진 모서리에 배지로 겹쳐 있다.
          우리 아바타는 사진이 아니라 이니셜+색 블록이지만, 색 아바타 위에 배지를
          얹는 건 흔한 UI 관례라 시안대로 맞췄다 — 이름 옆보다 "이 아바타의 계정"이라는
          연결이 더 분명하다. */}
      <div className="relative shrink-0">
        <ArtistAvatar name={name} size={160} shape="square" />
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="absolute -bottom-2 -right-2 flex size-[36px] items-center justify-center rounded-pill border border-border bg-surface text-ink shadow-card"
          >
            <AtSign size={18} aria-hidden />
          </a>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {/* 장르가 비어 있으면(전체의 상당수) 칩 자리를 그리지 않는다 — "미분류" 문구를 새로 만들지 않는다 */}
        {genre ? <Badge className="w-fit">{GENRE_LABELS[genre]}</Badge> : null}

        <h1 className="text-hero text-ink">{name}</h1>

        {otherNames.length ? (
          <p className="text-caption-strong text-muted">{otherNames.join(" | ")}</p>
        ) : null}
      </div>
    </div>
  );
}
