import { Container } from "@/components/layout/Container";
import { Chip } from "@/components/ui/Chip";
import { InlineFilter } from "@/components/ui/InlineFilter";
import { SearchPill } from "@/components/ui/SearchPill";
import { SpecimenSection } from "@/app/showcase/_components/Specimen";

export default function ShowcaseChipPage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Chip · SearchPill · InlineFilter</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md 칩 4종이 셋으로 갈린다. search-pill은 검색 어포던스,
        inline-filter는 r10이라 모양이 다르다.
      </p>

      <SpecimenSection title="Chip — filter (h36)">
        <Chip variant="filter" active>
          전체
        </Chip>
        <Chip variant="filter">진행 중</Chip>
        <Chip variant="filter">예정</Chip>
        <Chip variant="filter">종료</Chip>
      </SpecimenSection>

      <SpecimenSection title="Chip — sheet (h30)">
        <Chip variant="sheet">외부인 입장 가능</Chip>
        <Chip variant="sheet">티켓 필요</Chip>
        <Chip variant="sheet">학생증 확인</Chip>
      </SpecimenSection>

      <SpecimenSection title="SearchPill">
        <div className="flex w-full flex-col gap-6">
          <div>
            <SearchPill placeholder="축제·아티스트 검색" />
            <p className="mt-2 text-label text-muted">
              default · 320×36 · 13/400
            </p>
          </div>
          <div>
            <SearchPill variant="nav" placeholder="검색" />
            <p className="mt-2 text-label text-muted">nav · 280×40 · 14/400</p>
          </div>
        </div>
      </SpecimenSection>

      <SpecimenSection title="InlineFilter">
        <InlineFilter label="최신순" />
        <InlineFilter label="지역" />
      </SpecimenSection>
    </Container>
  );
}
