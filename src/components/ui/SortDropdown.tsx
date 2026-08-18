"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  basePath: string;
  className?: string;
};

/** 정렬 드롭다운. URL의 sort 쿼리를 바꾸고 나머지 쿼리(genre 등)는 보존, page는 리셋한다 */
export function SortDropdown<T extends string>({
  value,
  options,
  basePath,
  className = "",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const label = options.find((o) => o.value === value)?.label ?? value;

  const select = (next: T) => {
    setOpen(false);
    if (next === value) return;
    const params = new URLSearchParams(searchParams);
    params.set("sort", next);
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-[36px] min-w-[104px] cursor-pointer items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 text-ink text-meta"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={16} className="shrink-0" aria-hidden />
      </button>

      {open ? (
        <ul className="absolute right-0 top-[calc(100%+4px)] z-10 w-full min-w-[128px] overflow-hidden rounded-sm border border-border bg-surface text-meta shadow-card">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => select(option.value)}
                className={`w-full cursor-pointer px-3 py-2 text-left hover:bg-surface-field ${
                  option.value === value ? "text-primary" : "text-ink"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
