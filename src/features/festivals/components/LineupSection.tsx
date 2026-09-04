import type { LineupDay } from "@/features/festivals/types";
import { DayCard } from "./DayCard";

type Props = {
  lineup: LineupDay[];
};

// 바텀시트("전체 라인업 보기")를 없앴다 — day 카드가 전원을 보여준다 (#168).
// 상태가 사라져 서버 컴포넌트로 돌아왔다.
export function LineupSection({ lineup }: Props) {
  return (
    <section>
      <h2 className="text-block-title text-ink">라인업</h2>

      {lineup.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {lineup.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">라인업이 아직 공개되지 않았습니다.</p>
      )}
    </section>
  );
}
