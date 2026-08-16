import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="text-section-title text-ink">{SITE_NAME}</h1>
      <p className="text-body text-muted">{SITE_DESCRIPTION}</p>
      <Link href="/showcase" className="text-body text-primary">
        컴포넌트 쇼케이스 보기 →
      </Link>
    </div>
  );
}
