import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { search } from "@/features/search/api";
import type { SearchType } from "@/features/search/types";
import { ArtistResultCard } from "@/features/search/components/ArtistResultCard";
import { SchoolResultRow } from "@/features/search/components/SchoolResultRow";
import { FestivalResultRow } from "@/features/search/components/FestivalResultRow";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/ui/AdSlot";
import { Chip } from "@/components/ui/Chip";

const TYPE_OPTIONS: { value: SearchType | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "ARTIST", label: "아티스트" },
  { value: "HOST", label: "학교" },
  { value: "FESTIVAL", label: "축제" },
];

function typeHref(q: string, type: SearchType | null) {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);
  return `/search?${params}`;
}

function SearchBar({ q }: { q: string }) {
  return (
    <form
      action="/search"
      className="flex h-[64px] items-center gap-3 rounded-card border border-border bg-surface px-6"
    >
      <SearchIcon size={20} className="shrink-0 text-muted-soft" aria-hidden />
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="학교, 축제, 아티스트 검색"
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
      <Container className="mt-10 mb-16">
        <SearchBar q="" />
        <p className="mt-10 text-body text-muted">검색어를 입력해주세요.</p>
      </Container>
    );
  }

  const res = await search({ q, type });
  // 실패해도 throw하지 않는다 — 결과 0건과 같은 빈 상태로 보여준다.
  const data = res.ok
    ? res.data
    : {
        query: q,
        selectedType: type,
        counts: { all: 0, festival: 0, artist: 0, host: 0 },
        festivals: [],
        artists: [],
        hosts: [],
        relatedKeywords: [] as string[],
      };

  return (
    <Container className="mt-10 mb-16">
      <SearchBar q={q} />

      <p className="mt-8 text-body text-muted">
        “{q}” 검색 결과 {data.counts.all}건
      </p>

      <div className="mt-6 flex items-center gap-2">
        {TYPE_OPTIONS.map((option) => {
          const value: SearchType = option.value ?? "ALL";
          return (
            <Link key={value} href={typeHref(q, option.value)}>
              <Chip active={value === type}>{option.label}</Chip>
            </Link>
          );
        })}
      </div>

      {data.artists.length ? (
        <section className="mt-10">
          <h2 className="text-block-title text-ink">아티스트</h2>
          <div className="mt-4 flex flex-col gap-4">
            {data.artists.map((artist) => (
              <ArtistResultCard key={artist.artistId} artist={artist} />
            ))}
          </div>
        </section>
      ) : null}

      {data.hosts.length ? (
        <section className="mt-10">
          <h2 className="text-block-title text-ink">학교</h2>
          <div className="mt-4 flex flex-col gap-3">
            {data.hosts.map((host) => (
              <SchoolResultRow key={host.id} host={host} />
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

      {!data.counts.all ? (
        <div className="mt-10">
          <p className="text-body text-muted">검색 결과가 없습니다.</p>
          {data.relatedKeywords.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-caption-strong text-muted">추천 검색어</span>
              {data.relatedKeywords.map((keyword) => (
                <Link key={keyword} href={`/search?q=${encodeURIComponent(keyword)}`}>
                  <Chip>{keyword}</Chip>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <AdSlot variant="banner" className="mt-16" />
    </Container>
  );
}
