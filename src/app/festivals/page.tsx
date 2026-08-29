import Link from "next/link";
import { getFestivals } from "@/features/festivals/api";
import type { FestivalSort } from "@/features/festivals/types";
import { FestivalCard } from "@/features/festivals/components/FestivalCard";
import { parsePage } from "@/lib/searchParams";
import { Container } from "@/components/layout/Container";
import { SearchPill } from "@/components/ui/SearchPill";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";
import { PageFadeIn } from "@/components/ui/PageFadeIn";

const SORT_OPTIONS: { value: FestivalSort; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: "UPCOMING", label: "다가오는 순" },
];

const PAGE_SIZE = 10;

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; artistId?: string }>;
};

export default async function FestivalsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const sort: FestivalSort = params.sort === "UPCOMING" ? "UPCOMING" : "LATEST";
  const artistId = params.artistId ? Number(params.artistId) : undefined;

  let res = await getFestivals({ page: page - 1, size: PAGE_SIZE, sort, artistId });

  if (!res.ok) {
    console.error("GET /festivals 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="mt-10 text-body text-muted">축제 목록을 불러오지 못했습니다.</p>
      </Container>
    );
  }

  // 상한 클램프 — ?page=99(총 2페이지)로 들어오면 목록은 비고 캡션·이전 화살표만
  // 잘못된 페이지를 가리키게 된다. 실제로 존재하는 마지막 페이지로 다시 받는다.
  // totalPages가 0(필터 결과 자체가 0건)이면 클램프 대상이 없다 — 그대로 두면
  // page: -1로 재요청하게 되어 정상적인 빈 상태 대신 에러 화면이 뜬다.
  let currentPage = page;
  if (currentPage > res.data.totalPages && res.data.totalPages > 0) {
    currentPage = res.data.totalPages;
    res = await getFestivals({ page: currentPage - 1, size: PAGE_SIZE, sort, artistId });
    if (!res.ok) {
      console.error("GET /festivals 실패", res.status, res.message);
      return (
        <Container className="mt-10 mb-16">
          <p className="mt-10 text-body text-muted">축제 목록을 불러오지 못했습니다.</p>
        </Container>
      );
    }
  }

  const data = res.data;

  return (
    // nav·footer에서 "축제"를 눌러 들어오는 화면이라, 뚝 뜨지 않고 진입 시
    // 부드럽게 나타나게 한다
    <PageFadeIn>
      <Container className="mt-10 mb-16">
        <nav className="flex items-center gap-1 text-meta text-muted-soft">
          <Link href="/">홈</Link>
          <span>›</span>
          <span className="text-ink">축제</span>
        </nav>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-hero text-ink">축제 전체</h1>
            <p className="mt-2 text-body text-muted">
              전국 대학 축제 라인업을 한 곳에서 확인하세요
            </p>
          </div>
          <span className="mt-4 shrink-0 text-caption-strong text-muted">
            전체 {data.totalElements}개 ›
          </span>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <SearchPill placeholder="학교 또는 축제 이름 검색" />
          <SortDropdown value={sort} options={SORT_OPTIONS} />
        </div>

        {data.items.length ? (
          <div className="mt-10 grid grid-cols-2 gap-[25px] sm:grid-cols-3 lg:grid-cols-5">
            {data.items.map((festival) => (
              <FestivalCard key={festival.festivalId} festival={festival} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-body text-muted">등록된 축제가 없습니다.</p>
        )}

        {data.totalPages > 1 ? (
          <Pagination
            className="mt-16"
            page={currentPage}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            makeHref={(p) => {
              // page/sort 말고 다른 쿼리(q, artistId 등)가 나중에 붙어도 페이지
              // 이동 시 사라지지 않도록 현재 쿼리를 먼저 복사한다.
              const entries = Object.entries(params).filter(
                (entry): entry is [string, string] => entry[1] != null,
              );
              const qs = new URLSearchParams(entries);
              qs.set("page", String(p));
              qs.set("sort", sort);
              return `/festivals?${qs}`;
            }}
          />
        ) : null}

        <AdSlot variant="banner" className="mt-16" />
      </Container>
    </PageFadeIn>
  );
}
