import Link from "next/link";
import { redirect } from "next/navigation";
import { getArtists } from "@/features/artists/api";
import type { ArtistGenre, ArtistSort } from "@/features/artists/types";
import { ArtistRow } from "@/features/artists/components/ArtistRow";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { parsePage } from "@/lib/searchParams";
import { Container } from "@/components/layout/Container";
import { SearchPill } from "@/components/ui/SearchPill";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";

const PAGE_SIZE = 10;

const GENRE_OPTIONS: { value: ArtistGenre | null; label: string }[] = [
  { value: null, label: "전체" },
  ...(Object.entries(GENRE_LABELS) as [ArtistGenre, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

const SORT_OPTIONS: { value: ArtistSort; label: string }[] = [
  { value: "APPEARANCES", label: "출연 많은 순" },
  { value: "NAME", label: "이름순" },
];

const VALID_GENRES = Object.keys(GENRE_LABELS) as ArtistGenre[];

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; genre?: string }>;
};

export default async function ArtistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const sort: ArtistSort = params.sort === "NAME" ? "NAME" : "APPEARANCES";
  const genre = VALID_GENRES.find((g) => g === params.genre);

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

  const res = await getArtists({ page: page - 1, size: PAGE_SIZE, genre, sort });
  if (!res.ok) {
    console.error("GET /artists 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="mt-10 text-body text-muted">아티스트 목록을 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const data = res.data;

  // ?page=99(총 2페이지)로 들어오면 목록은 비고 캡션·이전 화살표만 잘못된 페이지를
  // 가리키게 된다. 실제로 존재하는 마지막 페이지로 보낸다.
  if (data.totalPages > 0 && page > data.totalPages) {
    redirect(makeHref({ page: data.totalPages }));
  }

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

      {/* 필터·검색·정렬을 하나의 패널로 묶는다 — 경계 없이 요소만 떠 있으면 좁은
          화면에서 세로로 쌓일 때 특히 정리 안 된 느낌이 강하다. LostPanel·
          search-filter-panel과 같은 패널 언어(테두리+r20+패딩)를 재사용해 헤더·
          결과 목록과 시각적으로 구분되는 하나의 섹션으로 만든다. */}
      <div className="mt-10 rounded-card border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-2 shrink-0 text-meta text-muted">장르</span>
            <div className="flex flex-wrap items-center gap-2">
              {GENRE_OPTIONS.map((option) => (
                <Link key={option.value ?? "all"} href={makeHref({ genre: option.value })}>
                  <Chip active={option.value === (genre ?? null)}>
                    {option.label}
                  </Chip>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SearchPill placeholder="아티스트 이름 검색" />
            <SortDropdown value={sort} options={SORT_OPTIONS} />
          </div>
        </div>
      </div>

      {data.items.length ? (
        // 실사진이 없는 아티스트를 카드 그리드로 키워봤자 이니셜 원 하나뿐이라
        // 정보 밀도가 낮다 — 행으로 나열해 한 화면에 더 많이 훑을 수 있게 한다.
        // 그리드와 달리 컬럼 수 브레이크포인트가 필요 없어 반응형도 더 단순하다.
        // 개별 박스 대신 divide-y 구분선만 그어 텍스트가 위 제목과 같은 위치에서
        // 시작하게 한다(윈도우 탐색기 자세히보기 느낌).
        <div className="mt-10 flex flex-col divide-y divide-border">
          {data.items.map((artist) => (
            <ArtistRow key={artist.artistId} artist={artist} />
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
