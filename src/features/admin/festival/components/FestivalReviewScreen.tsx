"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { FestivalReviewTable } from "@/features/admin/festival/components/FestivalReviewTable";
import {
  useAdminFestivals,
  usePublishFestival,
  useUnpublishFestival,
} from "@/features/admin/festival/queries";
import { parsePage } from "@/lib/searchParams";
import { ADMIN_ROUTES } from "@/constants/routes";
import { DISCOVERY_LABELS, type Discovery } from "@/lib/adminEnums";
import { ADMIN_GENERIC_ERROR_MESSAGE, AdminApiError, adminErrorMessage } from "@/lib/adminError";

const PAGE_SIZE = 10;

function parsePublished(raw: string | null): boolean | undefined {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

const VALID_DISCOVERY = Object.keys(DISCOVERY_LABELS) as Discovery[];

function parseDiscovery(raw: string | null): Discovery | undefined {
  return VALID_DISCOVERY.find((d) => d === raw);
}

export function FestivalReviewScreen() {
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const published = parsePublished(searchParams.get("published"));
  const discovery = parseDiscovery(searchParams.get("discovery"));
  const q = searchParams.get("q") ?? undefined;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const list = useAdminFestivals({
    published,
    discovery,
    q,
    page: page - 1,
    size: PAGE_SIZE,
  });
  const publish = usePublishFestival();
  const unpublish = useUnpublishFestival();

  const items = list.data?.items ?? [];

  function makeHref(next: { page?: number; published?: boolean | undefined }) {
    const p = new URLSearchParams();
    const nextPublished = "published" in next ? next.published : published;
    if (nextPublished !== undefined) p.set("published", String(nextPublished));
    if (discovery) p.set("discovery", discovery);
    if (q) p.set("q", q);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    return qs ? `${ADMIN_ROUTES.festivals}?${qs}` : ADMIN_ROUTES.festivals;
  }

  function reportError(action: string, error: unknown) {
    // DEC-0041: message는 개발자용이라 콘솔로만 보낸다.
    console.error(`${action} 실패`, error);
    setErrorMessage(
      error instanceof AdminApiError
        ? adminErrorMessage(error.errorCode)
        : ADMIN_GENERIC_ERROR_MESSAGE,
    );
  }

  function handlePublish(id: number) {
    setErrorMessage(null);
    publish.mutate(id, { onError: (error) => reportError("축제 발행", error) });
  }

  function handleUnpublish(id: number) {
    setErrorMessage(null);
    unpublish.mutate(id, { onError: (error) => reportError("축제 발행 해제", error) });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-row-title text-ink">축제 검수</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip href={makeHref({ published: false, page: 1 })} active={published === false}>
            미발행
          </FilterChip>
          <FilterChip href={makeHref({ published: true, page: 1 })} active={published === true}>
            발행됨
          </FilterChip>
          <FilterChip href={makeHref({ published: undefined, page: 1 })} active={published === undefined}>
            전체
          </FilterChip>
        </div>

        {/* min-w-0 — flex 아이템의 기본 min-width:auto가 축소를 막아, 안쪽 검색창의
            max-w-full이 기준을 잃고 좁은 화면에서 본문을 가로로 민다 */}
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SortDropdown
            name="discovery"
            ariaLabel="출처"
            value={discovery ?? ""}
            options={[
              { value: "", label: "출처 전체" },
              ...VALID_DISCOVERY.map((d) => ({ value: d, label: DISCOVERY_LABELS[d] })),
            ]}
          />
          <SearchInput name="q" placeholder="축제명 검색" />
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-card border border-border bg-surface p-4 text-caption text-danger-ink"
        >
          {errorMessage}
        </div>
      ) : null}

      {list.isPending ? (
        <p className="text-body text-muted">불러오는 중…</p>
      ) : list.isError ? (
        <p className="text-body text-danger-ink">
          {list.error instanceof AdminApiError
            ? adminErrorMessage(list.error.errorCode)
            : ADMIN_GENERIC_ERROR_MESSAGE}
        </p>
      ) : items.length === 0 ? (
        <p className="text-body text-muted">현재 필터에 맞는 축제가 없습니다.</p>
      ) : (
        <FestivalReviewTable items={items} onPublish={handlePublish} onUnpublish={handleUnpublish} />
      )}

      {list.data && list.data.totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={list.data.totalPages}
          totalElements={list.data.totalElements}
          makeHref={(p) => makeHref({ page: p })}
        />
      ) : null}
    </div>
  );
}
