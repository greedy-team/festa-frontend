import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="mt-16 mb-16 flex flex-col items-center gap-4 py-20">
      <h1 className="text-section-title text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="text-body text-muted">주소가 바뀌었거나 삭제된 페이지예요.</p>
      <Link href="/" className="text-caption-strong text-primary">
        홈으로 →
      </Link>
    </Container>
  );
}
