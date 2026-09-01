"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useImportHistory } from "@/features/admin/import/queries";
import type { ImportStatus, ImportType } from "@/features/admin/import/types";
import { parsePage } from "@/lib/searchParams";
import { ADMIN_ROUTES } from "@/constants/routes";

const PAGE_SIZE = 10;

const TYPE_LABELS: Record<ImportType, string> = {
  BUNDLE: "번들",
  FESTIVALS: "축제",
  LINEUPS: "라인업",
  ARTISTS: "아티스트",
};

const STATUS_LABELS: Record<ImportStatus, string> = {
  PENDING: "대기",
  COMMITTED: "커밋됨",
  EXPIRED: "만료",
};

const STATUS_TONE = { PENDING: "warning", COMMITTED: "success", EXPIRED: "neutral" } as const;

function parseType(raw: string | null): ImportType | undefined {
  return (Object.keys(TYPE_LABELS) as ImportType[]).find((t) => t === raw);
}

function parseStatus(raw: string | null): ImportStatus | undefined {
  return (Object.keys(STATUS_LABELS) as ImportStatus[]).find((s) => s === raw);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("ko-KR");
}

export function ImportHistoryScreen() {
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const type = parseType(searchParams.get("type"));
  const status = parseStatus(searchParams.get("status"));

  const list = useImportHistory({ type, status, page: page - 1, size: PAGE_SIZE });
  const items = list.data?.items ?? [];

  function makeHref(next: number) {
    const p = new URLSearchParams();
    if (type) p.set("type", type);
    if (status) p.set("status", status);
    if (next > 1) p.set("page", String(next));
    const qs = p.toString();
    return qs ? `${ADMIN_ROUTES.importHistory}?${qs}` : ADMIN_ROUTES.importHistory;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-md text-ink">임포트 이력</h1>
        <Link href={ADMIN_ROUTES.imports} className="text-caption-strong text-primary underline">
          ← 크롤링 임포트
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SortDropdown
          name="type"
          ariaLabel="타입"
          value={type ?? ""}
          options={[
            { value: "", label: "타입 전체" },
            ...(Object.keys(TYPE_LABELS) as ImportType[]).map((t) => ({
              value: t,
              label: TYPE_LABELS[t],
            })),
          ]}
        />
        <SortDropdown
          name="status"
          ariaLabel="상태"
          value={status ?? ""}
          options={[
            { value: "", label: "상태 전체" },
            ...(Object.keys(STATUS_LABELS) as ImportStatus[]).map((s) => ({
              value: s,
              label: STATUS_LABELS[s],
            })),
          ]}
        />
      </div>

      {list.isLoading ? (
        <p className="text-label-regular text-muted">불러오는 중…</p>
      ) : list.isError ? (
        <p role="alert" className="text-label-regular text-danger">
          이력을 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p className="text-label-regular text-muted">임포트 이력이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
                <th className="p-4">업로드</th>
                <th className="p-4">타입</th>
                <th className="p-4">파일</th>
                <th className="p-4">상태</th>
                <th className="p-4">결과</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.importId} className="border-b border-divider last:border-0">
                  <td className="p-4 text-label-regular text-muted">
                    {formatDateTime(item.uploadedAt)}
                    {item.uploadedBy ? (
                      <span className="text-muted-soft"> · {item.uploadedBy}</span>
                    ) : null}
                  </td>
                  <td className="p-4 text-caption-regular text-ink">
                    {TYPE_LABELS[item.type]}
                  </td>
                  <td className="p-4 text-label-regular text-muted">
                    {item.fileNames.join(", ") || "—"}
                  </td>
                  <td className="p-4">
                    <StatusBadge tone={STATUS_TONE[item.status]}>
                      {STATUS_LABELS[item.status]}
                    </StatusBadge>
                  </td>
                  <td className="p-4 text-label-regular text-muted">
                    {item.result === null
                      ? "—"
                      : (["festivals", "lineups", "artists"] as const)
                          .map((s) => `${s} +${item.result![s].created}/~${item.result![s].updated}`)
                          .join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.data === undefined ? null : (
        <Pagination
          page={page}
          totalPages={list.data.totalPages}
          totalElements={list.data.totalElements}
          makeHref={makeHref}
        />
      )}
    </section>
  );
}
