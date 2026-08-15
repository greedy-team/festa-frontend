import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="text-section-title text-ink">FESTA</h1>
      <p className="text-body text-muted">전국 대학 축제·페스티벌 라인업 아카이브</p>
      <Link href="/showcase" className="text-body text-primary">
        컴포넌트 쇼케이스 보기 →
      </Link>
    </div>
  );
}
