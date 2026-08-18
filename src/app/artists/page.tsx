import Link from "next/link";
import { getArtists } from "@/features/artists/api";
import type { ArtistGenre, ArtistSort } from "@/features/artists/types";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { Container } from "@/components/layout/Container";
import { SearchPill } from "@/components/ui/SearchPill";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";

const PAGE_SIZE = 10;

const GENRE_OPTIONS: { value: ArtistGenre | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "HIPHOP", label: GENRE_LABELS.HIPHOP },
  { value: "BALLAD_RNB", label: GENRE_LABELS.BALLAD_RNB },
  { value: "BAND", label: GENRE_LABELS.BAND },
  { value: "DANCE", label: GENRE_LABELS.DANCE },
];

const SORT_OPTIONS: { value: ArtistSort; label: string }[] = [
  { value: "APPEARANCES", label: "출연 많은 순" },
  { value: "NAME", label: "이름순" },
];

const VALID_GENRES = GENRE_OPTIONS.map((o) => o.value).filter(
  (v): v is ArtistGenre => v !== null,
);

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; genre?: string }>;
};

export default async function ArtistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const sort: ArtistSort = params.sort === "NAME" ? "NAME" : "APPEARANCES";
  const genre = VALID_GENRES.find((g) => g === params.genre);

  const res = await getArtists({ page: page - 1, size: PAGE_SIZE, genre, sort });
  // 실패해도 throw하지 않는다 — 빈 목록으로 떨어뜨리고 아래에서 "없습니다"로 처리한다.
  const data = res.ok
    ? res.data
    : {
        items: [],
        page: page - 1,
        size: PAGE_SIZE,
        totalElements: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };

  // page는 항상 리셋, sort/genre는 유지 (기본값이면 쿼리에 남기지 않는다)
  const makeHref = (overrides: { page?: number; genre?: ArtistGenre | null }) => {
    const params = new URLSearchParams();
    const nextGenre = "genre" in overrides ? overrides.genre : genre;
    if (nextGenre) params.set("genre", nextGenre);
    if (sort !== "APPEARANCES") params.set("sort", sort);
    if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
    const qs = params.toString();
    return qs ? `/artists?${qs}` : "/artists";
  };

  return (
    <Container className="mt-10 mb-16">
      <nav className="flex items-center gap-1 text-meta text-muted-soft">
        <Link href="/">홈</Link>
        <span>›</span>
        <span className="text-ink">아티스트</span>
      </nav>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-hero text-ink">아티스트</h1>
          <p className="mt-2 text-body text-muted">
            대학 축제 무대에 오른 아티스트를 출연 기록으로 찾아보세요
          </p>
        </div>
        <span className="mt-4 shrink-0 text-caption-strong text-muted">
          전체 {data.totalElements}팀 ›
        </span>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-meta text-muted">장르</span>
          <div className="flex items-center gap-2">
            {GENRE_OPTIONS.map((option) => (
              <Link key={option.value ?? "all"} href={makeHref({ genre: option.value })}>
                <Chip active={option.value === (genre ?? null)}>
                  {option.label}
                </Chip>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SearchPill placeholder="아티스트 이름 검색" />
          <SortDropdown value={sort} options={SORT_OPTIONS} basePath="/artists" />
        </div>
      </div>

      {data.items.length ? (
        <div className="mt-10 grid grid-cols-5 gap-[25px]">
          {data.items.map((artist) => (
            <ArtistCard key={artist.artistId} artist={artist} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body text-muted">해당하는 아티스트가 없습니다.</p>
      )}

      {data.totalPages > 1 ? (
        <Pagination
          className="mt-16"
          page={page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          makeHref={(p) => makeHref({ page: p })}
        />
      ) : null}

      <AdSlot variant="banner" className="mt-16" />
    </Container>
  );
}
