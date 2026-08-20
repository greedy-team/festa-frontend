type Props = {
  count: number;
  current: number;
  onSelect: (index: number) => void;
};

export function HeroDots({ count, current, onSelect }: Props) {
  return (
    <div className="inline-flex h-[44px] items-center gap-4 rounded-pill bg-surface px-6">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${i + 1}번째 페이지`}
          aria-current={i === current ? "true" : undefined}
          className={
            i === current
              ? "size-[8px] cursor-pointer rounded-pill bg-ink"
              : "size-[6px] cursor-pointer rounded-pill bg-border-strong"
          }
        />
      ))}
    </div>
  );
}
