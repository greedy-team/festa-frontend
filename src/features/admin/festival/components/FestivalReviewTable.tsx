"use client";

import { useRef, useState } from "react";
import { PUBLISH_BLOCKER, type AdminFestival } from "@/features/admin/festival/types";
import { discoveryLabel, publishBlockerLabel } from "@/lib/adminEnums";
import { dateRange } from "@/lib/festivalDate";
import { safeHttpUrl } from "@/lib/safeUrl";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  items: AdminFestival[];
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (festival: AdminFestival) => void;
  onLineup: (festival: AdminFestival) => void;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
};

// 기간 표기는 lib/festivalDate.ts의 dateRange()를 쓴다 — 공개 화면이 이미 쓰는 함수다.
// 같은 포맷터를 여기서 다시 만들지 않는다.

/**
 * md 이상에서 table-fixed로 열 폭을 콘텐츠와 무관하게 고정한다.
 *
 * 실데이터의 sourceUrl이 percent-encoded 한글 URL(공백 없는 수백 자)이라, auto
 * 레이아웃에서는 그 셀이 표를 부풀려 가로 스크롤이 생기고 나머지 열이 쥐어짜져
 * 글자가 세로로 꺾였다. fixed면 어떤 값이 와도 표가 화면 폭을 넘지 않는다.
 * 긴 값은 말줄임하고 전문은 title로 — 더 보고 싶으면 열 경계를 끌어 넓힌다.
 */
const COLUMNS = [
  { key: "name", label: "축제", mobileVisible: true },
  { key: "host", label: "주최", mobileVisible: false },
  { key: "period", label: "기간", mobileVisible: false },
  { key: "lineup", label: "라인업", mobileVisible: false },
  { key: "discovery", label: "출처", mobileVisible: false },
  { key: "status", label: "상태", mobileVisible: true },
  { key: "publish", label: "", mobileVisible: true },
  { key: "actions", label: "", mobileVisible: true },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

// name은 폭을 지정하지 않는다 — table-fixed에서 남는 폭을 전부 가져간다.
const DEFAULT_WIDTHS: Partial<Record<ColumnKey, number>> = {
  host: 100,
  period: 120,
  lineup: 68,
  discovery: 80,
  status: 88,
  publish: 128,
  actions: 156,
};

const MIN_COLUMN_WIDTH = 64;

/**
 * safeHttpUrl은 스킴(`^https?://`)만 보고 파싱 가능 여부는 보지 않는다 — `"http://"`
 * 같은 크롤러 값이 통과해 여기 오면 new URL이 던진다. 행 렌더 안이라 그대로 두면 행
 * 하나가 표 전체를 무너뜨리므로 원본 문자열로 폴백한다.
 */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function FestivalReviewTable({
  items,
  onPublish,
  onUnpublish,
  onEdit,
  onDelete,
  onLineup,
  isPublishing = false,
  isUnpublishing = false,
}: Props) {
  // 열 크기 조절 상태. 저장하지 않는다 — 새로고침하면 기본 폭으로 돌아온다.
  const [widths, setWidths] = useState<Partial<Record<ColumnKey, number>>>({});
  const dragRef = useRef<{ key: ColumnKey; startX: number; startWidth: number } | null>(null);

  function handlePointerDown(event: React.PointerEvent<HTMLSpanElement>, key: ColumnKey) {
    // 시작 폭은 실측한다 — name처럼 폭 미지정(auto) 열도 여기서 값이 잡힌다.
    const th = event.currentTarget.parentElement;
    if (!(th instanceof HTMLElement)) return;
    dragRef.current = { key, startX: event.clientX, startWidth: th.offsetWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const width = Math.max(MIN_COLUMN_WIDTH, drag.startWidth + event.clientX - drag.startX);
    setWidths((prev) => ({ ...prev, [drag.key]: width }));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    // overflow-x-auto는 안전망으로 남긴다 — 열을 손으로 크게 늘리면 그때만 스크롤이 생긴다.
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full border-collapse md:table-fixed">
        <thead>
          <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
            {COLUMNS.map((column, index) => {
              const width = widths[column.key] ?? DEFAULT_WIDTHS[column.key];
              return (
                <th
                  key={column.key}
                  // 폭은 CSS 변수로 두고 md에서만 적용한다 — 모바일(auto 레이아웃,
                  // 접힌 열)에 데스크톱 폭이 새어 들어가지 않는다.
                  style={
                    width === undefined
                      ? undefined
                      : ({ "--col-w": `${width}px` } as React.CSSProperties)
                  }
                  className={`relative p-4 md:w-[var(--col-w)] ${
                    column.mobileVisible ? "" : "hidden md:table-cell"
                  }`}
                >
                  {column.label}
                  {index < COLUMNS.length - 1 ? (
                    // 엑셀식 열 경계 핸들. 모바일에선 숨긴다 — 터치 드래그가
                    // 스크롤과 싸우고, 거기선 열이 접혀 있어 필요 없다.
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      onPointerDown={(e) => handlePointerDown(e, column.key)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className="absolute inset-y-0 right-0 hidden w-1.5 cursor-col-resize touch-none select-none hover:bg-border-strong active:bg-border-strong md:block"
                    />
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((festival) => {
            const safeSourceUrl = festival.sourceUrl ? safeHttpUrl(festival.sourceUrl) : null;
            const isPublished = festival.publishedAt !== null;
            // 서버 스키마에 required 지정이 없어 필드가 비어 올 수 있다 — null 가드.
            const blockers = festival.blockers ?? [];
            const hasBlockers = blockers.length > 0;
            return (
              <tr key={festival.festivalId} className="border-b border-divider last:border-0">
                <td className="p-4">
                  <p className="text-caption-strong text-ink md:truncate" title={festival.name}>
                    {festival.name}
                  </p>
                  {festival.sourceUrl ? (
                    safeSourceUrl ? (
                      <a
                        href={safeSourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={festival.sourceUrl}
                        className="block truncate text-label-regular text-muted underline"
                      >
                        {/* URL 전문은 표에서 정보가치가 없다 — percent-encoded 한글
                            경로가 수백 자라 표를 부풀리던 주범이다. 호스트만 보여주고
                            전문은 title과 링크가 갖는다 */}
                        {hostnameOf(safeSourceUrl)} ↗
                      </a>
                    ) : (
                      // 크롤러가 서드파티 페이지에서 긁어온 값이라 http(s)가 아닐 수 있다.
                      // React는 텍스트를 이스케이프하지만 href의 스킴은 검사하지 않으므로,
                      // 안전하지 않은 값은 링크로 렌더하지 않고 원문 그대로만 보여준다.
                      <span
                        title={festival.sourceUrl}
                        className="block truncate text-label-regular text-muted-soft"
                      >
                        {festival.sourceUrl}
                      </span>
                    )
                  ) : (
                    <span className="text-label-regular text-muted-soft">출처 없음</span>
                  )}
                  {/* 모바일에서 접힌 열의 핵심만 서브라인으로 */}
                  <p className="text-label-regular text-muted md:hidden">
                    {dateRange(festival.startDate, festival.endDate)} · {festival.lineupCount}팀
                  </p>
                </td>
                <td className="hidden truncate whitespace-nowrap p-4 text-caption text-body-text md:table-cell">
                  {festival.hostId === null ? (
                    <span className="text-muted-soft">미연결</span>
                  ) : (
                    (festival.hostName ?? "—")
                  )}
                </td>
                <td className="hidden whitespace-nowrap p-4 text-caption text-body-text md:table-cell">
                  {dateRange(festival.startDate, festival.endDate)}
                </td>
                <td className="hidden whitespace-nowrap p-4 md:table-cell">
                  {blockers.includes(PUBLISH_BLOCKER.LINEUP_EMPTY) ? (
                    <StatusBadge tone="danger">0팀</StatusBadge>
                  ) : (
                    <span className="text-caption text-body-text">{festival.lineupCount}팀</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap p-4 md:table-cell">
                  {festival.discovery ? (
                    <StatusBadge>{discoveryLabel(festival.discovery)}</StatusBadge>
                  ) : (
                    <span className="text-caption text-muted-soft">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap p-4">
                  {isPublished ? (
                    <StatusBadge tone="success">발행됨</StatusBadge>
                  ) : (
                    <StatusBadge tone="warning">미발행</StatusBadge>
                  )}
                </td>
                <td className="p-4 text-right">
                  {isPublished ? (
                    <button
                      type="button"
                      disabled={isUnpublishing}
                      onClick={() => {
                        if (window.confirm(`${festival.name}의 발행을 해제할까요?`)) {
                          onUnpublish(festival.festivalId);
                        }
                      }}
                      className="cursor-pointer whitespace-nowrap text-caption-strong text-danger-ink disabled:cursor-not-allowed disabled:text-muted-soft"
                    >
                      해제
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        disabled={hasBlockers || isPublishing}
                        onClick={() => onPublish(festival.festivalId)}
                        className="cursor-pointer whitespace-nowrap text-caption-strong text-primary disabled:cursor-not-allowed disabled:text-muted-soft"
                      >
                        발행
                      </button>
                      {hasBlockers ? (
                        <span
                          title={blockers.map((reason) => publishBlockerLabel(reason)).join(" · ")}
                          className="max-w-full truncate text-label-regular text-muted-soft"
                        >
                          {blockers.map((reason) => publishBlockerLabel(reason)).join(" · ")}
                        </span>
                      ) : null}
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  {/* 검수에서 INVALID를 본 운영자가 곧바로 손으로 채우는 동선 —
                      발행이 막힌 행일수록 이 링크가 그 행의 실질 액션이다 */}
                  <div className="flex flex-col items-end gap-2 md:flex-row md:justify-end md:gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(festival.festivalId)}
                      className="cursor-pointer whitespace-nowrap text-caption-strong text-primary"
                    >
                      고치기
                    </button>
                    <button
                      type="button"
                      onClick={() => onLineup(festival)}
                      className="cursor-pointer whitespace-nowrap text-caption-strong text-primary"
                    >
                      라인업
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(festival)}
                      className="cursor-pointer whitespace-nowrap text-caption-strong text-danger-ink"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
