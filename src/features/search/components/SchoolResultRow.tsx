import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HostResult } from "@/features/search/types";

type Props = {
  host: HostResult;
};

// 로고 자리를 그리지 않는다 — 값이 실제로 없고(DEC-0093) 빈 자리를 색 블록으로
// 채우지 않는다(DEC-0130). 주최 상세 히어로와 같은 판정이다.
// 복구 지점: logoUrl에 값이 생기면 이름 왼쪽에 로고를 다시 넣는다.
export function SchoolResultRow({ host }: Props) {
  const { hostId, name, festivalCount, latestFestivalYearMonth } = host;

  return (
    <Link
      href={`/hosts/${hostId}`}
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-subtitle text-ink">{name}</h3>
        <p className="mt-1 text-caption-strong text-muted">
          {festivalCount}개 축제
          {latestFestivalYearMonth
            ? ` · 최근 ${latestFestivalYearMonth.replace("-", ".")}`
            : ""}
        </p>
      </div>

      <ChevronRight size={20} className="shrink-0 text-muted-soft" aria-hidden />
    </Link>
  );
}
