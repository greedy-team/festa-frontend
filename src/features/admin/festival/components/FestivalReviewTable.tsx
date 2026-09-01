"use client";

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
  return (
    // 넓은 표는 자기 컨테이너 안에서 스크롤한다 — 페이지가 가로로 밀리면 안 된다.
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
            <th className="p-4">축제</th>
            <th className="p-4">주최</th>
            <th className="p-4">기간</th>
            <th className="p-4">라인업</th>
            <th className="p-4">출처</th>
            <th className="p-4">상태</th>
            <th className="p-4" />
            <th className="p-4" />
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
                  <p className="text-caption-strong text-ink">{festival.name}</p>
                  {festival.sourceUrl ? (
                    safeSourceUrl ? (
                      <a
                        href={safeSourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-label-regular text-muted underline"
                      >
                        {festival.sourceUrl.replace(/^https?:\/\//, "")} ↗
                      </a>
                    ) : (
                      // 크롤러가 서드파티 페이지에서 긁어온 값이라 http(s)가 아닐 수 있다.
                      // React는 텍스트를 이스케이프하지만 href의 스킴은 검사하지 않으므로,
                      // 안전하지 않은 값은 링크로 렌더하지 않고 원문 그대로만 보여준다.
                      <span className="text-label-regular text-muted-soft">
                        {festival.sourceUrl}
                      </span>
                    )
                  ) : (
                    <span className="text-label-regular text-muted-soft">출처 없음</span>
                  )}
                </td>
                <td className="p-4 text-caption text-body-text">
                  {festival.hostId === null ? (
                    <span className="text-muted-soft">미연결</span>
                  ) : (
                    (festival.hostName ?? "—")
                  )}
                </td>
                <td className="p-4 text-caption text-body-text">
                  {dateRange(festival.startDate, festival.endDate)}
                </td>
                <td className="p-4">
                  {blockers.includes(PUBLISH_BLOCKER.LINEUP_EMPTY) ? (
                    <StatusBadge tone="danger">0팀</StatusBadge>
                  ) : (
                    <span className="text-caption text-body-text">{festival.lineupCount}팀</span>
                  )}
                </td>
                <td className="p-4">
                  {festival.discovery ? (
                    <StatusBadge>{discoveryLabel(festival.discovery)}</StatusBadge>
                  ) : (
                    <span className="text-caption text-muted-soft">—</span>
                  )}
                </td>
                <td className="p-4">
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
                      className="cursor-pointer text-caption-strong text-danger-ink disabled:cursor-not-allowed disabled:text-muted-soft"
                    >
                      해제
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        disabled={hasBlockers || isPublishing}
                        onClick={() => onPublish(festival.festivalId)}
                        className="cursor-pointer text-caption-strong text-primary disabled:cursor-not-allowed disabled:text-muted-soft"
                      >
                        발행
                      </button>
                      {hasBlockers ? (
                        <span className="text-label-regular text-muted-soft">
                          {blockers.map((reason) => publishBlockerLabel(reason)).join(" · ")}
                        </span>
                      ) : null}
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  {/* 검수에서 INVALID를 본 운영자가 곧바로 손으로 채우는 동선 —
                      발행이 막힌 행일수록 이 링크가 그 행의 실질 액션이다 */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(festival.festivalId)}
                      className="cursor-pointer text-caption-strong text-primary"
                    >
                      고치기
                    </button>
                    <button
                      type="button"
                      onClick={() => onLineup(festival)}
                      className="cursor-pointer text-caption-strong text-primary"
                    >
                      라인업
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(festival)}
                      className="cursor-pointer text-caption-strong text-danger-ink"
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
