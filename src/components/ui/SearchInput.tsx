"use client";

import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  /** 쿼리 파라미터 이름 */
  name: string;
  placeholder?: string;
  className?: string;
};

/**
 * SearchPill은 aria-hidden에 input이 없는 표시 전용이라 실제 검색에 못 쓴다.
 * 여기서는 GET 폼으로 제출해 쿼리스트링을 브라우저가 만들게 한다 —
 * 필터 상태가 URL에 사는 이 화면의 방식과 맞는다.
 */
export function SearchInput({ name, placeholder = "검색", className = "" }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    // `inline-flex`(shrink-to-fit)로 두면 안쪽 `max-w-full`이 기준을 잃어 좁은 화면에서
    // 280px가 그대로 이기고 페이지 본문이 가로로 밀린다. 폼 자신이 줄어들 수 있어야 한다.
    <form action={pathname} className={`flex min-w-0 max-w-full ${className}`}>
      {/* 검색하면 페이지는 1로 돌아가야 한다. page를 넘기지 않으면 기본값 1이다. */}
      {[...searchParams.entries()]
        .filter(([key]) => key !== name && key !== "page")
        .map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

      <div className="inline-flex h-[36px] w-[280px] max-w-full items-center gap-2 rounded-pill bg-surface-field px-4">
        <input
          name={name}
          defaultValue={searchParams.get(name) ?? ""}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent text-meta text-ink outline-none placeholder:text-muted-soft"
        />
        <button type="submit" aria-label="검색" className="cursor-pointer">
          <Search size={16} className="shrink-0 text-muted-soft" aria-hidden />
        </button>
      </div>
    </form>
  );
}
