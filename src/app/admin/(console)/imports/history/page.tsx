import { Suspense } from "react";
import { ImportHistoryScreen } from "@/features/admin/import/components/ImportHistoryScreen";

// useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense 경계가 필요하다.
export default function ImportHistoryPage() {
  return (
    <Suspense fallback={<p className="text-body text-muted">불러오는 중…</p>}>
      <ImportHistoryScreen />
    </Suspense>
  );
}
