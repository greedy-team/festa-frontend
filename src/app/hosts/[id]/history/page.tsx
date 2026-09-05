import Link from "next/link";
import { redirect } from "next/navigation";
import { getHost } from "@/features/hosts/api";
import { getFestivals } from "@/features/festivals/api";
import type { FestivalSort } from "@/features/festivals/types";
import { FestivalHistoryCard } from "@/features/hosts/components/FestivalHistoryCard";
import { parsePage } from "@/lib/searchParams";
import { Container } from "@/components/layout/Container";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";
import { PageFadeIn } from "@/components/ui/PageFadeIn";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: FestivalSort; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: "UPCOMING", label: "오래된순" },
];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sort?: string; year?: string }>;
};

export default async function FestivalHistoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const hostId = Number(id);
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const sort: FestivalSort = sp.sort === "UPCOMING" ? "UPCOMING" : "LATEST";

  const hostRes = await getHost(hostId);
  // 실패해도 throw하지 않는다 — 이 화면은 host 정보 없이는 의미가 없어 안내 문구로 대체한다.
  if (!hostRes.ok) {
    return (
      <Container className="mt-10 mb-16">
        <p className="text-body text-muted">학교 정보를 불러올 수 없습니다.</p>
      </Container>
    );
  }
  const host = hostRes.data;
  const year = host.availableYears.find((y) => String(y) === sp.year);
  const basePath = `/hosts/${hostId}/history`;

  // page는 항상 리셋, sort/year는 유지 (기본값이면 쿼리에 남기지 않는다)
  const makeHref = (overrides: { page?: number; year?: number | null }) => {
    const params = new URLSearchParams();
    const nextYear = "year" in overrides ? overrides.year : year;
    if (nextYear) params.set("year", String(nextYear));
    if (sort !== "LATEST") params.set("sort", sort);
    if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const festivalsRes = await getFestivals({
    page: page - 1,
    size: PAGE_SIZE,
    sort,
    hostId,
    year,
  });
  if (!festivalsRes.ok) {
    console.error("GET /festivals 실패", festivalsRes.status, festivalsRes.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="text-body text-muted">축제 이력을 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const data = festivalsRes.data;

  // ?page=99(총 2페이지)로 들어오면 목록은 비고 캡션·이전 화살표만 잘못된 페이지를
  // 가리키게 된다. 실제로 존재하는 마지막 페이지로 보낸다.
  if (data.totalPages > 0 && page > data.totalPages) {
    redirect(makeHref({ page: data.totalPages }));
  }

  const minYear = Math.min(...host.availableYears);

  return (
    // 학교 상세로에서 넘어오는 화면이라 뚝 뜨지 않고 진입 시 부드럽게 나타나게 한다
    // (축제·아티스트 목록 화면과 같은 PageFadeIn)
    <PageFadeIn>
      <Container className="mt-10 mb-16">
        <nav className="flex items-center gap-1 text-caption text-muted">
          <Link href="/">홈</Link>
          <span>›</span>
          <span>학교</span>
          <span>›</span>
          <span>{host.name}</span>
          <span>›</span>
          <span className="text-ink">축제 이력</span>
        </nav>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-hero text-ink">축제 이력</h1>
            <p className="mt-2 text-body text-muted">
              {host.shortName} · {minYear}년부터 아카이브된 축제 {data.totalElements}개
            </p>
          </div>
          <Link
            href={`/hosts/${hostId}`}
            className="mt-4 shrink-0 text-caption-strong text-muted"
          >
            학교 상세로 →
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-caption text-muted">연도</span>
            <div className="flex items-center gap-2">
              <Link href={makeHref({ year: null })}>
                <Chip active={!year}>전체</Chip>
              </Link>
              {host.availableYears.map((y) => (
                <Link key={y} href={makeHref({ year: y })}>
                  <Chip active={year === y}>{y}</Chip>
                </Link>
              ))}
            </div>
          </div>

          <SortDropdown value={sort} options={SORT_OPTIONS} />
        </div>

        {data.items.length ? (
          <div className="mt-10 grid grid-cols-2 gap-[25px] sm:grid-cols-3 lg:grid-cols-5">
            {data.items.map((festival) => (
              <FestivalHistoryCard key={festival.festivalId} festival={festival} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-body text-muted">해당 연도의 축제 이력이 없습니다.</p>
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
    </PageFadeIn>
  );
}
