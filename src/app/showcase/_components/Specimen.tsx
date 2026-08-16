import type { ReactNode } from "react";

type Props = {
  /** 컴포넌트 이름 — DESIGN.md의 컴포넌트 키를 그대로 쓴다 */
  name: string;
  /** 실측 치수. `360×952` 형태 */
  size: string;
  /** 사용처 화면 번호. `06-D` 등 */
  usedIn?: string;
  /**
   * 한 줄을 통째로 쓰는 표본. 1280 폭 행이나 그리드처럼 넓은 것에 쓴다.
   *
   * 이 값은 표본 상자(=flex 아이템) 자신에 걸어야 한다. 안쪽 자식에 `w-full`을
   * 걸면 부모가 내용 크기라 100%의 기준이 없어 찌그러진다.
   */
  full?: boolean;
  children: ReactNode;
};

/**
 * 컴포넌트 표본 하나.
 *
 * DESIGN.md 「컴포넌트 시트」의 조판 규칙을 따른다 —
 * 라벨은 `<이름> · <W>×<H> (<사용처 화면번호>)`, 컴포넌트는 라벨 22px 아래.
 */
export function Specimen({
  name,
  size,
  usedIn,
  full = false,
  children,
}: Props) {
  return (
    <div className={full ? "flex w-full flex-col" : "flex flex-col"}>
      <span className="text-label text-muted-soft">
        {name} · {size}
        {usedIn ? ` (${usedIn})` : ""}
      </span>
      <div className="mt-[22px]">{children}</div>
    </div>
  );
}

/** 시트의 섹션 헤더 — 제목 아래 1px 디바이더 */
export function SpecimenSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 first:mt-0">
      <h2 className="text-row-title text-ink">{title}</h2>
      <div className="mt-8 h-px w-full bg-divider" />
      <div className="mt-8 flex flex-wrap items-start gap-x-12 gap-y-10">
        {children}
      </div>
    </section>
  );
}
