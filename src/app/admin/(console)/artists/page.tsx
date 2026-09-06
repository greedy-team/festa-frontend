import { Suspense } from "react";
import { ArtistAdminScreen } from "@/features/admin/artist/components/ArtistAdminScreen";

// useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense 경계가 필요하다.
export default function ArtistAdminPage() {
  return (
    <Suspense fallback={<p className="text-body text-muted">불러오는 중…</p>}>
      <ArtistAdminScreen />
    </Suspense>
  );
}
