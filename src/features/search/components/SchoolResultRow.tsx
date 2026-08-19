import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HostResult } from "@/features/search/types";
import { gridTint } from "@/lib/posterTint";
import { PosterImage } from "@/components/ui/PosterImage";

type Props = {
  host: HostResult;
};

/** #51에서 만든 축제 이력 화면으로 실제 연결된다 — School Detail이 없는 유일한 실제 진입점 */
export function SchoolResultRow({ host }: Props) {
  const { id, name, logoUrl, festivalCount, latestFestivalYearMonth } = host;

  return (
    <Link
      href={`/hosts/${id}/history`}
      className="flex items-center gap-4 rounded-row border border-border bg-surface px-6 py-4"
    >
      <div
        className={`relative size-[56px] shrink-0 overflow-hidden rounded-pill ${gridTint(id)}`}
      >
        <PosterImage
          src={logoUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

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
