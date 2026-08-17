import Link from "next/link";
import { getFestivals } from "@/features/festivals/api";
import type { FestivalSort } from "@/features/festivals/types";
import { FestivalCard } from "@/features/festivals/components/FestivalCard";
import { SortDropdown } from "@/features/festivals/components/SortDropdown";
import { Container } from "@/components/layout/Container";
import { SearchPill } from "@/components/ui/SearchPill";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";

const PAGE_SIZE = 10;

type Props = {
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export default async function FestivalsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const sort: FestivalSort = params.sort === "UPCOMING" ? "UPCOMING" : "LATEST";

  const res = await getFestivals({ page: page - 1, size: PAGE_SIZE, sort });
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

  return (
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
        <SortDropdown sort={sort} />
      </div>

      {data.items.length ? (
        <div className="mt-10 grid grid-cols-5 gap-[25px]">
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
          page={page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          makeHref={(p) => `/festivals?page=${p}&sort=${sort}`}
        />
      ) : null}

      <AdSlot variant="banner" className="mt-16" />
    </Container>
  );
}
