import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function ShowcaseButtonPage() {
  return (
    <Container className="py-16">
      <h1 className="text-section-title text-ink">Button</h1>
      <p className="mt-3 text-caption text-muted">
        색 3 × 크기 3. 폭은 컴포넌트가 아니라 사용처가 정한다.
      </p>

      <h2 className="mt-16 text-row-title text-ink">시안 실측 조합</h2>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Button variant="primary" size="md" className="w-full max-w-[180px]">
          button-primary 180×48
        </Button>
        <Button variant="secondary" size="lg" className="w-full max-w-[200px]">
          button-secondary 200×52
        </Button>
        <Button variant="reset" size="lg" className="w-full max-w-[120px]">
          초기화
        </Button>
      </div>

      <h2 className="mt-16 text-row-title text-ink">시트 버튼 (높이 44)</h2>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Button variant="primary" size="sheet" className="w-full max-w-[584px]">
          상세 정보 보기 →
        </Button>
        <Button variant="secondary" size="sheet" className="w-full max-w-[536px]">
          공유하기 (시트 secondary는 글자색이 ink다)
        </Button>
      </div>

      <h2 className="mt-16 text-row-title text-ink">전 조합</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(["primary", "secondary", "reset"] as const).map((variant) =>
          (["md", "lg", "sheet"] as const).map((size) => (
            <div key={`${variant}-${size}`}>
              <Button variant={variant} size={size} className="w-full">
                {variant} / {size}
              </Button>
              <p className="mt-2 text-label text-muted">
                {variant} · {size}
              </p>
            </div>
          )),
        )}
      </div>
    </Container>
  );
}
