"use client";

import { usePathname, useSearchParams } from "next/navigation";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  className?: string;
  /** 쿼리 파라미터 이름. 정렬 외의 단일선택 필터에도 쓴다 */
  name?: string;
  ariaLabel?: string;
};

/**
 * 정렬 드롭다운. GET 폼 + 네이티브 select로 제출한다 — 키보드·스크린리더·JS 미로드
 * 전부 브라우저가 처리한다. sort 이외의 현재 쿼리(genre 등)는 hidden input으로 그대로
 * 실어 보내고, page는 hidden input을 안 둬서 제출할 때 자동으로 빠진다(=리셋).
 */
export function SortDropdown<T extends string>({
  value,
  options,
  className = "",
  name = "sort",
  ariaLabel = "정렬",
}: Props<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const preserved = Array.from(searchParams.entries()).filter(
    ([key]) => key !== name && key !== "page",
  );

  return (
    <form method="GET" action={pathname} className={`inline-block ${className}`}>
      {preserved.map(([key, val]) => (
        <input key={key} type="hidden" name={key} value={val} />
      ))}
      <select
        name={name}
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        aria-label={ariaLabel}
        className="h-[36px] min-w-[104px] cursor-pointer rounded-sm border border-border bg-surface px-3 text-ink text-meta"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
