import { Search } from "lucide-react";

type Size = "md" | "nav";

// 높이와 타입 스케일은 시안 값을 그대로 쓴다.
// 폭은 시안 값을 기준으로 두되 `max-w-full`로 좁은 화면에서 줄어들게 한다.
// `w-full max-w-[…]`로 쓰면 안 된다 — 부모가 내용에 맞춰 줄어드는 자리(헤더의
// inline 래퍼 등)에서는 100%가 내용 폭이 되어 pill이 글자 크기로 쪼그라든다.
const SIZE: Record<Size, string> = {
  md: "h-[36px] w-[320px] max-w-full text-meta",
  nav: "h-[40px] w-[280px] max-w-full text-caption",
};

type Props = {
  size?: Size;
  placeholder?: string;
  className?: string;
};

export function SearchPill({
  size = "md",
  placeholder = "검색",
  className = "",
}: Props) {
  return (
    // 실제 검색 동작이 붙기 전까지는 표시 전용이다. 조작·포커스가 안 되므로
    // 보조기술에는 숨긴다.
    <div
      aria-hidden
      className={`inline-flex items-center justify-between rounded-pill bg-surface-field px-4 text-muted-soft ${SIZE[size]} ${className}`}
    >
      <span className="truncate">{placeholder}</span>
      <Search size={16} className="shrink-0" aria-hidden />
    </div>
  );
}
