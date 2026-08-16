import { Container } from "@/components/layout/Container";
import { Chip } from "@/components/ui/Chip";
import { InlineFilter } from "@/components/ui/InlineFilter";
import { SearchPill } from "@/components/ui/SearchPill";

export default function ShowcaseChipPage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Chip · SearchPill · InlineFilter</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md 칩 4종이 셋으로 갈린다. search-pill은 검색 어포던스,
        inline-filter는 r10이라 모양이 다르다.
      </p>

      <h2 className="mt-16 text-row-title text-ink">Chip — filter (h36)</h2>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Chip variant="filter" active>
          전체
        </Chip>
        <Chip variant="filter">진행 중</Chip>
        <Chip variant="filter">예정</Chip>
        <Chip variant="filter">종료</Chip>
      </div>

      <h2 className="mt-16 text-row-title text-ink">Chip — sheet (h30)</h2>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Chip variant="sheet">외부인 입장 가능</Chip>
        <Chip variant="sheet">티켓 필요</Chip>
        <Chip variant="sheet">학생증 확인</Chip>
      </div>

      <h2 className="mt-16 text-row-title text-ink">SearchPill</h2>
      <div className="mt-6 flex w-full flex-col gap-6">
        <div>
          <SearchPill placeholder="축제·아티스트 검색" />
          <p className="mt-2 text-label text-muted">default · 320×36 · 13/400</p>
        </div>
        <div>
          <SearchPill variant="nav" placeholder="검색" />
          <p className="mt-2 text-label text-muted">nav · 280×40 · 14/400</p>
        </div>
      </div>

      <h2 className="mt-16 text-row-title text-ink">InlineFilter</h2>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <InlineFilter label="최신순" />
        <InlineFilter label="지역" />
      </div>
    </Container>
  );
}
