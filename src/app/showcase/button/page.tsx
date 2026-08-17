import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SpecimenSection } from "@/app/showcase/_components/Specimen";

export default function ShowcaseButtonPage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Button</h1>
      <p className="mt-3 text-caption text-muted">
        DESIGN.md에 정의된 버튼 5종. 폭은 컴포넌트가 아니라 사용처가 정한다.
      </p>

      {/* 폭은 `w-[…] max-w-full` 순서로 준다. 반대로 쓰면 부모가 내용 폭인
          자리에서 100%의 기준이 사라진다 (coding-principles.md) */}
      <SpecimenSection title="시안 실측 조합">
        <Button variant="primary" size="md" className="w-[180px] max-w-full">
          button-primary 180×48
        </Button>
        <Button variant="secondary" size="lg" className="w-[200px] max-w-full">
          button-secondary 200×52
        </Button>
        <Button variant="reset" size="lg" className="w-[120px] max-w-full">
          초기화
        </Button>
      </SpecimenSection>

      <SpecimenSection title="시트 버튼 (높이 44)">
        <Button variant="primary" size="sm" className="w-[584px] max-w-full">
          상세 정보 보기 →
        </Button>
        <Button
          variant="secondary-ink"
          size="sm"
          className="w-[536px] max-w-full"
        >
          공유하기 (시트 secondary는 글자색이 ink다)
        </Button>
      </SpecimenSection>
    </Container>
  );
}
