import Link from "next/link";
import { redirect } from "next/navigation";
import { getArtists } from "@/features/artists/api";
import type { ArtistGenre, ArtistSort } from "@/features/artists/types";
import { ArtistRow } from "@/features/artists/components/ArtistRow";
import { GENRE_LABELS } from "@/lib/artistGenre";
import { parsePage } from "@/lib/searchParams";
import { Container } from "@/components/layout/Container";
import { ArtistSearchForm } from "@/features/artists/components/ArtistSearchForm";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";
import { PageFadeIn } from "@/components/ui/PageFadeIn";

const PAGE_SIZE = 10;

const GENRE_OPTIONS: { value: ArtistGenre | null; label: string }[] = [
  { value: null, label: "전체" },
  ...(Object.entries(GENRE_LABELS) as [ArtistGenre, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

// SortDropdown은 GET 폼 + 네이티브 select라 모바일에서 칩 줄바꿈보다 훨씬
// 깔끔하다 — 정렬과 같은 컴포넌트를 그대로 재사용한다. null(전체)은 select에
// 담을 수 없어 빈 문자열로 바꾼다("genre=" 쿼리는 페이지에서 undefined와
// 동일하게 처리돼 그대로 "전체"가 된다).
const GENRE_SELECT_OPTIONS = GENRE_OPTIONS.map(({ value, label }) => ({
  value: value ?? "",
  label,
}));

const SORT_OPTIONS: { value: ArtistSort; label: string }[] = [
  { value: "APPEARANCES", label: "출연 많은 순" },
  { value: "NAME", label: "이름순" },
];

const VALID_GENRES = Object.keys(GENRE_LABELS) as ArtistGenre[];

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; genre?: string; q?: string }>;
};

export default async function ArtistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const sort: ArtistSort = params.sort === "NAME" ? "NAME" : "APPEARANCES";
  const genre = VALID_GENRES.find((g) => g === params.genre);
  const q = params.q?.trim() || undefined;

  // page는 항상 리셋, sort/genre/q는 유지 (기본값이면 쿼리에 남기지 않는다)
  const makeHref = (overrides: { page?: number; genre?: ArtistGenre | null }) => {
    const params = new URLSearchParams();
    const nextGenre = "genre" in overrides ? overrides.genre : genre;
    if (nextGenre) params.set("genre", nextGenre);
    if (sort !== "APPEARANCES") params.set("sort", sort);
    if (q) params.set("q", q);
    if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
    const qs = params.toString();
    return qs ? `/artists?${qs}` : "/artists";
  };

  const res = await getArtists({ page: page - 1, size: PAGE_SIZE, genre, sort, q });
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
    // nav의 "아티스트" 링크로 들어오는 화면이라, 뚝 뜨지 않고 진입 시
    // 부드럽게 나타나게 한다(축제 목록과 같은 PageFadeIn)
    <PageFadeIn>
      {/* 상세 화면과 같은 읽기 폭(1200px)으로 맞춘다 */}
      <Container className="mt-10 mb-16 max-w-[1200px] mx-auto">
        {/* Container 자체의 모바일 여백(px-4)만으로는 박스(패널)를 걷어낸 뒤라
            글자가 화면 끝에 붙어 보였다 — sm 미만에서만 안쪽 여백을 살짝 더 준다.
            Container의 px-4와 같은 속성을 다른 요소(자식)에 얹는 거라 클래스
            우선순위 충돌 없이 그대로 더해진다. */}
        <div className="px-2 sm:px-0">
          <nav className="flex items-center gap-1 text-meta text-muted-soft">
            <Link href="/">홈</Link>
            <span>›</span>
            <span className="text-ink">아티스트</span>
          </nav>

          <div className="mt-2">
            <h1 className="text-hero text-ink">아티스트</h1>
            {/* 모바일에서는 필터까지 합치면 화면 대부분을 설명 텍스트가
                차지해서 뺀다 — 데스크톱은 여유가 있어 그대로 둔다 */}
            <p className="mt-2 hidden text-body text-muted sm:block">
              대학 축제 무대에 오른 아티스트를 출연 기록으로 찾아보세요
            </p>
          </div>

          {/* 패널(테두리+배경)로 묶었다가 뺐다 — 모바일에서도 장식 없이
              심플하게, 위 제목·아래 목록과 같은 톤으로 이어지게 한다. */}
          <div className="mt-10">
            {/* 모바일 전용 레이아웃 — 검색이 위, 장르·정렬 셀렉트를 한 줄에 나란히 */}
            <div className="flex flex-col gap-3 sm:hidden">
              <ArtistSearchForm defaultValue={q} genre={genre} sort={sort} />
              <div className="flex items-center gap-3">
                <SortDropdown
                  value={genre ?? ""}
                  options={GENRE_SELECT_OPTIONS}
                  name="genre"
                  ariaLabel="장르"
                />
                <SortDropdown value={sort} options={SORT_OPTIONS} />
              </div>
            </div>

            {/* sm 이상 — 기존 그대로 (장르 칩 왼쪽, 검색·정렬 오른쪽) */}
            <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
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
                <ArtistSearchForm defaultValue={q} genre={genre} sort={sort} />
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
            <p className="mt-10 text-body text-muted">
              {q ? `"${q}"에 해당하는 아티스트가 없습니다.` : "해당하는 아티스트가 없습니다."}
            </p>
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
        </div>
      </Container>
    </PageFadeIn>
  );
}
