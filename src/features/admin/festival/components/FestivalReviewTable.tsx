"use client";

import { publishBlocker } from "@/features/admin/festival/api";
import { PUBLISH_BLOCKER, type AdminFestival } from "@/features/admin/festival/types";
import { discoveryLabel } from "@/lib/adminEnums";
import { dateRange } from "@/lib/festivalDate";
import { safeHttpUrl } from "@/lib/safeUrl";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  items: AdminFestival[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  onUnpublish: (id: number) => void;
};

// 기간 표기는 lib/festivalDate.ts의 dateRange()를 쓴다 — 공개 화면이 이미 쓰는 함수다.
// 같은 포맷터를 여기서 다시 만들지 않는다.

export function FestivalReviewTable({
  items,
  selected,
  onToggle,
  onUnpublish,
}: Props) {
  return (
    // 넓은 표는 자기 컨테이너 안에서 스크롤한다 — 페이지가 가로로 밀리면 안 된다.
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
            <th className="w-[48px] p-4" />
            <th className="p-4">축제</th>
            <th className="p-4">주최</th>
            <th className="p-4">기간</th>
            <th className="p-4">라인업</th>
            <th className="p-4">출처</th>
            <th className="p-4">상태</th>
            <th className="p-4" />
          </tr>
        </thead>
        <tbody>
          {items.map((festival) => {
            const blocker = publishBlocker(festival);
            const safeSourceUrl = festival.sourceUrl ? safeHttpUrl(festival.sourceUrl) : null;
            return (
              <tr key={festival.festivalId} className="border-b border-divider last:border-0">
                <td className="p-4">
                  <input
                    type="checkbox"
                    aria-label={`${festival.name} 선택`}
                    checked={selected.has(festival.festivalId)}
                    disabled={festival.published}
                    onChange={() => onToggle(festival.festivalId)}
                    className="size-[18px] cursor-pointer accent-primary disabled:cursor-not-allowed"
                  />
                </td>
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
                  {/* publishBlocker를 거치지 않고 hostId를 직접 본다 — publishBlocker는
                      사유를 하나만(LINEUP_EMPTY 우선) 반환하므로, 라인업 0팀이면서
                      주최도 미연결인 행은 그 경유로 판정하면 HOST_NOT_LINKED가 가려져
                      주최명이 잘못 뜬다. 이 열은 "발행 가능한가"를 답하므로 그 경우도
                      미연결로 보여준다. */}
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
                  {blocker === PUBLISH_BLOCKER.LINEUP_EMPTY ? (
                    <StatusBadge tone="danger">0팀</StatusBadge>
                  ) : (
                    <span className="text-caption text-body-text">{festival.lineupCount}팀</span>
                  )}
                </td>
                <td className="p-4">
                  <StatusBadge>{discoveryLabel(festival.discovery)}</StatusBadge>
                </td>
                <td className="p-4">
                  {festival.published ? (
                    <StatusBadge tone="success">발행됨</StatusBadge>
                  ) : (
                    <StatusBadge tone="warning">미발행</StatusBadge>
                  )}
                </td>
                <td className="p-4 text-right">
                  {festival.published ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`${festival.name}의 발행을 해제할까요?`)) {
                          onUnpublish(festival.festivalId);
                        }
                      }}
                      className="cursor-pointer text-caption-strong text-danger-ink"
                    >
                      해제
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
