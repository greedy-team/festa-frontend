import Link from "next/link";
import type { HostFestivalHistoryItem } from "@/features/hosts/types";
import { FestivalHistoryCard } from "./FestivalHistoryCard";

type Props = {
  hostId: number;
  items: HostFestivalHistoryItem[];
  total: number;
};

/**
 * 응답이 미리보기 2건 + 전체 건수만 준다. 전체 목록은 축제 이력 화면
 * (/hosts/{id}/history, #51)의 몫이라 여기선 페이지네이션도, 연도 필터도 만들지 않는다.
 */
export function FestivalHistorySection({ hostId, items, total }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-block-title text-ink">축제 이력</h2>
        <Link
          href={`/hosts/${hostId}/history`}
          className="text-caption-strong text-muted-soft"
        >
          전체 {total}개 →
        </Link>
      </div>

      {items.length ? (
        // 카드는 그리드 칸을 꽉 채우지 않는다 — 고유 폭(236px)이 있는 카드라
        // grid-cols로 늘리면 세로 비율이 깨진다 (coding-principles 카드/패널 폭 규칙).
        <div className="mt-4 flex flex-wrap gap-4">
          {items.map((item) => (
            <div key={item.festivalId} className="w-[236px] max-w-full">
              <FestivalHistoryCard festival={item} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">등록된 축제 이력이 없습니다.</p>
      )}
    </section>
  );
}
