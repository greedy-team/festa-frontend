// lucide-react 1.x는 브랜드(SNS) 아이콘을 빼서 Instagram 아이콘이 없다 — AtSign으로 대체
import { AtSign } from "lucide-react";
import type { ArtistDetail } from "@/features/artists/types";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { safeHttpUrl } from "@/lib/safeUrl";
import { Badge } from "@/components/ui/Badge";

type Props = {
  artist: ArtistDetail;
};

// 이름 배경 전체를 해시 색으로 채우는 안도 만들어봤는데, "사진 없는 자리는
// 색 배경으로 때운다"는 흔한 패턴이라 오히려 뻔해 보였다 — 걷어내고 타이포
// 자체(크기·자간)로 존재감을 낸다. 아바타(이니셜+색 블록)도 같은 이유로 뺐다.
export function ArtistHero({ artist }: Props) {
  const { name, otherNames, genre, instagramUrl } = artist;
  const genreLabel = genre && GENRE_LABELS[genre] ? GENRE_LABELS[genre] : null;
  // 관리자 등록 API가 URL 형식을 검사하지 않는다 (DEC-0107) — http(s)가 아니면 링크로 그리지 않는다
  const safeInstagramUrl = instagramUrl ? safeHttpUrl(instagramUrl) : null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {/* 장르가 비어 있으면(전체의 상당수) 칩 자리를 그리지 않는다 — "미분류" 문구를
          새로 만들지 않는다. genre는 타입상 ArtistGenre로 좁혀지지만 값은 네트워크에서
          오므로, 백엔드가 명세 밖 값을 내리면 GENRE_LABELS[genre]가 undefined가 될 수
          있어 조회 자체를 가드한다. */}
      {genreLabel ? <Badge className="w-fit">{genreLabel}</Badge> : null}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-hero text-ink">{name}</h1>
        {safeInstagramUrl ? (
          <a
            href={safeInstagramUrl}
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
