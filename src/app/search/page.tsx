import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { search } from "@/features/search/api";
import type { SearchCounts, SearchType } from "@/features/search/types";
import { ArtistResultRow } from "@/features/search/components/ArtistResultRow";
import { SchoolResultRow } from "@/features/search/components/SchoolResultRow";
import { FestivalResultRow } from "@/features/search/components/FestivalResultRow";
import { Container } from "@/components/layout/Container";
import { PageFadeIn } from "@/components/ui/PageFadeIn";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";

const TYPE_OPTIONS: { value: SearchType | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "ARTIST", label: "아티스트" },
  { value: "HOST", label: "학교" },
  { value: "FESTIVAL", label: "축제" },
];

// counts.all은 세 도메인 매치 수의 합이라 타입 필터와 무관하다. 특정 타입으로
// 좁히면 그 타입 count만 봐야 헤더 수치와 실제로 그려진 섹션이 어긋나지 않는다 (#145).
//
// 헤더 수치는 이 count, 빈 상태 판정(isEmpty)은 실제 렌더된 배열 길이 — 판정 기준이
// 둘이지만 현재 계약에선 항상 같은 값이다. 백엔드가 선택 타입 count를 list.size()로
// 내고 검색 쿼리 세 개 모두 LIMIT이 없어서다. 둘이 어긋나려면 백엔드 결함이 필요하다.
const COUNT_KEY: Record<Exclude<SearchType, "ALL">, keyof SearchCounts> = {
  ARTIST: "artist",
  HOST: "host",
  FESTIVAL: "festival",
};

function typeHref(q: string, type: SearchType | null) {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);
  return `/search?${params}`;
}

function SearchBar({ q }: { q: string }) {
  return (
    <form
      action="/search"
      className="flex h-[64px] items-center gap-3 rounded-card border border-border bg-surface px-6 focus-within:ring-2 focus-within:ring-primary"
    >
      <SearchIcon size={20} className="shrink-0 text-muted-soft" aria-hidden />
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="학교, 축제, 아티스트 검색"
        aria-label="검색어"
        className="h-full flex-1 bg-transparent text-body text-ink placeholder:text-muted-soft focus:outline-none"
      />
      <button
        type="submit"
        className="flex h-[44px] shrink-0 items-center justify-center rounded-md bg-primary px-6 text-button text-on-primary"
      >
        검색
      </button>
    </form>
  );
}

type Props = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const type: SearchType =
    sp.type === "ARTIST" || sp.type === "HOST" || sp.type === "FESTIVAL"
      ? sp.type
      : "ALL";

  if (!q) {
    return (
      <PageFadeIn>
        <Container className="mt-10 mb-16">
          {/* 검색창은 있지만 페이지 제목이 시각적으로는 필요 없는 화면이라, 시맨틱
              구조만 sr-only h1로 채운다 — h2 결과 섹션들이 짚을 상위 헤딩이 없으면
              스크린리더 사용자가 페이지 시작점을 못 잡는다. */}
          <h1 className="sr-only">검색</h1>
          <SearchBar q="" />
          <p className="mt-10 text-body text-muted">검색어를 입력해주세요.</p>
        </Container>
      </PageFadeIn>
    );
  }

  const res = await search({ q, type });
  if (!res.ok) {
    console.error("GET /search 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <h1 className="sr-only">검색</h1>
        <SearchBar q={q} />
        <p className="mt-10 text-body text-muted">검색 결과를 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const data = res.data;
  const resultCount =
    type === "ALL" ? data.counts.all : data.counts[COUNT_KEY[type]];
  const isEmpty =
    !data.artists.length && !data.hosts.length && !data.festivals.length;

  return (
    // nav나 다른 화면의 링크로 들어오는 화면이라, 뚝 뜨지 않고 진입 시
    // 부드럽게 나타나게 한다(다른 사용자 화면과 같은 PageFadeIn).
    <PageFadeIn>
      <Container className="mt-10 mb-16">
        <h1 className="sr-only">검색</h1>
        <SearchBar q={q} />

        <p className="mt-8 text-body text-muted">
          “{q}” 검색 결과 {resultCount}건
        </p>

        <div className="mt-6 flex items-center gap-2">
          {TYPE_OPTIONS.map((option) => {
            const value: SearchType = option.value ?? "ALL";
            const active = value === type;
            return (
              <Link
                key={value}
                href={typeHref(q, option.value)}
                aria-current={active ? "true" : undefined}
              >
                <Chip active={active}>{option.label}</Chip>
              </Link>
            );
          })}
        </div>

        {data.artists.length ? (
          <section className="mt-10">
            <h2 className="text-block-title text-ink">아티스트</h2>
            <div className="mt-4 flex flex-col gap-3">
              {data.artists.map((artist) => (
                <ArtistResultRow key={artist.artistId} artist={artist} />
              ))}
            </div>
          </section>
        ) : null}

        {data.hosts.length ? (
          <section className="mt-10">
            <h2 className="text-block-title text-ink">학교</h2>
            <div className="mt-4 flex flex-col gap-3">
              {data.hosts.map((host) => (
                <SchoolResultRow key={host.hostId} host={host} />
              ))}
            </div>
          </section>
        ) : null}

        {data.festivals.length ? (
          <section className="mt-10">
            <h2 className="text-block-title text-ink">축제</h2>
            <div className="mt-4 flex flex-col gap-3">
              {data.festivals.map((festival) => (
                <FestivalResultRow
                  key={festival.festivalId}
                  festival={festival}
                  query={q}
                />
              ))}
            </div>
          </section>
        ) : null}

        {isEmpty ? (
          <p className="mt-10 text-body text-muted">검색 결과가 없습니다.</p>
        ) : null}

        <AdSlot variant="banner" className="mt-16" />
      </Container>
    </PageFadeIn>
  );
}
