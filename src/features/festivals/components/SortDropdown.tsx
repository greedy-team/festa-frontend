"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { FestivalSort } from "@/features/festivals/types";

const OPTIONS: { value: FestivalSort; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: "UPCOMING", label: "다가오는 순" },
];

type Props = {
  sort: FestivalSort;
  className?: string;
};

/** 정렬 변경. InlineFilter와 같은 표기를 쓰되 실제로 동작한다 (#42) */
export function SortDropdown({ sort, className = "" }: Props) {
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

  const label = OPTIONS.find((o) => o.value === sort)?.label ?? sort;

  const selectSort = (next: FestivalSort) => {
    setOpen(false);
    if (next === sort) return;
    const params = new URLSearchParams(searchParams);
    params.set("sort", next);
    params.delete("page"); // 정렬이 바뀌면 1페이지부터 다시 본다
    router.push(`/festivals?${params.toString()}`);
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
          {OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => selectSort(option.value)}
                className={`w-full cursor-pointer px-3 py-2 text-left hover:bg-surface-field ${
                  option.value === sort ? "text-primary" : "text-ink"
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
