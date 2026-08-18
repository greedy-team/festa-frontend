import type { UpcomingHostFestival } from "@/features/hosts/types";
import { UpcomingFestivalCard } from "./UpcomingFestivalCard";

type Props = {
  festivals: UpcomingHostFestival[];
};

/** 대학 축제는 봄·가을에 몰려 있어 0건인 시기가 더 흔하다 — 정상 상태로 둔다 (#46) */
export function UpcomingFestivalsSection({ festivals }: Props) {
  return (
    <section>
      <h2 className="text-block-title text-ink">다가오는 축제</h2>
      {festivals.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => (
            <UpcomingFestivalCard key={festival.festivalId} festival={festival} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body text-muted">예정된 축제가 없습니다.</p>
      )}
    </section>
  );
}
