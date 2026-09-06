import type { ReactNode } from "react";

const STYLE = {
  // filter-chip 비활성 — h36 pill, 패딩 0 20 (DESIGN.md 명시)
  filter: "h-[36px] px-5 bg-surface border border-border text-muted text-caption-strong",
  // filter-chip 활성 — 인디고 채움, 테두리 없음
  "filter-active": "h-[36px] px-5 bg-primary text-on-primary text-caption-strong",
  // sheet-chip — h30. 패딩은 DESIGN.md에 없어 px-4(16px)를 기본값으로 둔다
  sheet: "h-[30px] px-4 bg-surface border border-border text-body-strong text-label-regular",
} as const;

// sheet에는 활성 상태가 없다 — DESIGN.md의 sheet-chip은 한 가지뿐이다.
// 타입으로 막지 않으면 <Chip variant="sheet" active>가 에러도 경고도 없이
// 비활성과 똑같이 그려진다.
type Props = {
  className?: string;
  children: ReactNode;
} & (
  | { variant?: "filter"; active?: boolean }
  | { variant: "sheet"; active?: never }
);

export function Chip({
  variant = "filter",
  active = false,
  className = "",
  children,
}: Props) {
  const key = active ? "filter-active" : variant;

  return (
    <span
      // shrink-0 + whitespace-nowrap — 칩 목록이 좁은 화면에서 줄바꿈될 때
      // 칩 자체가 찌그러들며 라벨 중간이 다음 줄로 잘리는 것을 막는다
      // (예: "발라드·R&B"가 "·R&B"만 떨어져 나가는 문제)
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-pill ${STYLE[key]} ${className}`}
    >
      {children}
    </span>
  );
}
