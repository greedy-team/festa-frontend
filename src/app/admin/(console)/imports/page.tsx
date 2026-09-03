import { Suspense } from "react";
import { ImportScreen } from "@/features/admin/import/components/ImportScreen";

export default function ImportPage() {
  return (
    <Suspense fallback={<p className="text-body text-muted">불러오는 중…</p>}>
      <ImportScreen />
    </Suspense>
  );
}
