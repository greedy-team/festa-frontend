"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import { FestivalReviewTable } from "@/features/admin/festival/components/FestivalReviewTable";
import {
  useAdminFestivals,
  useFestivalCounts,
  usePublishFestivals,
  useUnpublishFestival,
} from "@/features/admin/festival/queries";
import { publishBlocker } from "@/features/admin/festival/api";
import type { BulkPublishResult } from "@/features/admin/festival/types";
import { parsePage } from "@/lib/searchParams";
import { ADMIN_ROUTES } from "@/constants/routes";
import { DISCOVERY_LABELS, publishBlockerLabel, type Discovery } from "@/lib/adminEnums";
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

/** 픽스처·실데이터 어느 쪽이든 없는 연도는 서버가 빈 목록으로 답한다 */
function parseYear(raw: string | null): number | undefined {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 2000 && n <= 2100 ? n : undefined;
}

export function FestivalReviewScreen() {
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const published = parsePublished(searchParams.get("published"));
  const discovery = parseDiscovery(searchParams.get("discovery"));
  const year = parseYear(searchParams.get("year"));
  const q = searchParams.get("q") ?? undefined;

  const [selected, setSelected] = useState<Set<number>>(new Set());
  // 배너는 화면에 하나뿐이다 — "가장 최근 액션의 결과"를 하나의 상태로 표현한다.
  // 두 슬롯(result/error) + 렌더 우선순위였을 때, 해제 성공 콜백이 error만 지우고
  // result는 안 지워 오래된 발행 결과가 되살아나는 순서 문제가 있었다.
  const [outcome, setOutcome] = useState<
    { type: "publish"; result: BulkPublishResult } | { type: "error"; message: string } | null
  >(null);

  const list = useAdminFestivals({
    published,
    discovery,
    year,
    q,
    page: page - 1,
    size: PAGE_SIZE,
  });
  const counts = useFestivalCounts();
  const publish = usePublishFestivals();
  const unpublish = useUnpublishFestival();

  // 필터·페이지가 바뀌면 선택은 초기화한다 — 화면에서 사라진 행의 id가 선택에
  // 남아있으면 blockedSelections가 그 행을 못 보고, 다음 발행 요청에 조용히 섞여 들어간다.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 의도적: 화면 밖으로 벗어난 선택을 즉시 비운다
    setSelected(new Set());
  }, [page, published, discovery, year, q]);

  const items = list.data?.items ?? [];
  const blockedSelections = items.filter(
    (festival) =>
      selected.has(festival.festivalId) && publishBlocker(festival) !== null,
  );

  function makeHref(next: { page?: number; published?: boolean | undefined }) {
    const p = new URLSearchParams();
    const nextPublished = "published" in next ? next.published : published;
    if (nextPublished !== undefined) p.set("published", String(nextPublished));
    if (discovery) p.set("discovery", discovery);
    if (year) p.set("year", String(year));
    if (q) p.set("q", q);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    return qs ? `${ADMIN_ROUTES.festivals}?${qs}` : ADMIN_ROUTES.festivals;
  }

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      // 새 Set을 만들어 바꾼다 — 기존 것을 제자리에서 고치지 않는다.
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handlePublish() {
    try {
      const res = await publish.mutateAsync([...selected]);
      setOutcome({ type: "publish", result: res });
      setSelected(new Set());
      // 목록 갱신은 usePublishFestivals의 invalidateQueries가 한다.
      // router.refresh()를 부르지 않는다 — 서버 컴포넌트가 없어 할 일이 없다.
    } catch (error) {
      // API의 message는 개발자용이라 그대로 보여주지 않는다 — 원인은 콘솔에, 안내는 평문으로.
      console.error("축제 발행 실패", error);
      setOutcome({
        type: "error",
        message:
          error instanceof AdminApiError
            ? adminErrorMessage(error.errorCode)
            : ADMIN_GENERIC_ERROR_MESSAGE,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-row-title text-ink">축제 검수</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            href={makeHref({ published: false, page: 1 })}
            active={published === false}
            count={counts.data?.unpublished}
          >
            미발행
          </FilterChip>
          <FilterChip
            href={makeHref({ published: true, page: 1 })}
            active={published === true}
            count={counts.data?.published}
          >
            발행됨
          </FilterChip>
          <FilterChip
            href={makeHref({ published: undefined, page: 1 })}
            active={published === undefined}
            count={counts.data?.total}
          >
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

      {outcome ? (
        <div
          role={outcome.type === "error" ? "alert" : "status"}
          className="rounded-card border border-border bg-surface p-4 text-caption text-body-text"
        >
          {outcome.type === "error" ? (
            <p className="text-danger-ink">{outcome.message}</p>
          ) : (
            <>
              <p>
                요청 {outcome.result.requested}건 중 {outcome.result.published}건 발행됨
                {outcome.result.failed.length > 0 ? `, ${outcome.result.failed.length}건 실패` : ""}
              </p>
              {outcome.result.failed.map((failure) => (
                <p key={failure.festivalId} className="text-danger-ink">
                  {failure.name} — {publishBlockerLabel(failure.reason)}
                </p>
              ))}
            </>
          )}
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
        <FestivalReviewTable
          items={items}
          selected={selected}
          onToggle={toggle}
          onUnpublish={(id) =>
            unpublish.mutate(id, {
              // 해제 성공은 표 갱신 외에 배너로 알릴 내용이 없다 — 이전 배너만 치운다.
              onSuccess: () => setOutcome(null),
              onError: (error) => {
                console.error("축제 발행 해제 실패", error);
                setOutcome({
                  type: "error",
                  message:
                    error instanceof AdminApiError
                      ? adminErrorMessage(error.errorCode)
                      : ADMIN_GENERIC_ERROR_MESSAGE,
                });
              },
            })
          }
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-caption text-muted">
          {selected.size}건 선택됨
          {blockedSelections.length > 0
            ? " · 라인업 0팀이거나 주최가 연결되지 않은 축제는 발행할 수 없습니다"
            : ""}
        </p>
        <Button
          type="button"
          disabled={selected.size === 0 || publish.isPending}
          onClick={handlePublish}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selected.size}건 발행하기
        </Button>
      </div>

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
