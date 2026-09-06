import { Search } from "lucide-react";
import type { FestivalSort } from "@/features/festivals/types";

type Props = {
  defaultValue?: string;
  sort: FestivalSort;
  /** /festivals?artistId= 로 들어온 필터 뷰에서 검색해도 필터가 안 풀리게 실어 보낸다 */
  artistId?: string;
  className?: string;
};

/**
 * 축제 목록 전용 실제 검색 폼 — ArtistSearchForm·NavSearchForm과 같은 GET 제출
 * 패턴이라 JS 없이도 동작한다. sort·artistId를 hidden input으로 그대로 실어 보내
 * 검색해도 지금 걸어둔 정렬·필터가 풀리지 않게 한다(page는 안 실어서 검색 시
 * 항상 1페이지로 리셋 — 다른 필터 변경과 같은 규칙).
 */
export function FestivalSearchForm({ defaultValue, sort, artistId, className = "" }: Props) {
  return (
    <form
      action="/festivals"
      className={`inline-flex h-[36px] w-[320px] max-w-full items-center justify-between rounded-pill bg-surface-field px-4 focus-within:ring-2 focus-within:ring-primary ${className}`}
    >
      {sort !== "LATEST" ? <input type="hidden" name="sort" value={sort} /> : null}
      {artistId ? <input type="hidden" name="artistId" value={artistId} /> : null}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="축제 이름 검색"
        className="w-full bg-transparent text-meta text-ink placeholder:text-muted-soft focus:outline-none"
      />
      <button type="submit" aria-label="검색" className="shrink-0 cursor-pointer text-muted-soft">
        <Search size={16} aria-hidden />
      </button>
    </form>
  );
}
