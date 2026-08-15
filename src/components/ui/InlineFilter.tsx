type Props = {
  label: string;
  className?: string;
};

// 시안은 104×36이지만 폭은 하한으로 둔다 — 라벨 길이는 데이터가 정하고
// 화면 폭도 우리가 정하지 않는다 (coding-principles 「코드 규약」).
// 라벨이 길면 늘어나고, 부모가 좁으면 말줄임한다 (`truncate`).
// 높이 36은 고정이라 줄바꿈은 쓰지 않는다 — 줄이 늘면 높이가 깨진다.
export function InlineFilter({ label, className = "" }: Props) {
  return (
    <div
      className={`inline-flex h-[36px] min-w-[104px] items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 text-ink text-meta ${className}`}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden>˅</span>
    </div>
  );
}
