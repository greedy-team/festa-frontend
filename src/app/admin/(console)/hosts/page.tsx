import { Suspense } from "react";
import { HostAdminScreen } from "@/features/admin/host/components/HostAdminScreen";

// useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense 경계가 필요하다.
export default function HostAdminPage() {
  return (
    <Suspense fallback={<p className="text-body text-muted">불러오는 중…</p>}>
      <HostAdminScreen />
    </Suspense>
  );
}
