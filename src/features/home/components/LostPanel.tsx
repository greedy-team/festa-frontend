type Props = {
  className?: string;
};

/**
 * lost-items API가 아직 없다 (P1 보류, 핸들러 없음). 번호 리스트 10행 대신 빈 상태를
 * 보여준다. 연동되면 이 자리를 리스트(행 간격 32, 번호 거터 48)로 교체한다.
 * "전체 보기" 링크는 목적지 화면이 없어서 생략한다 (SectionHeaderRow와 같은 규칙).
 */
export function LostPanel({ className = "" }: Props) {
  return (
    <div
      className={`flex h-[420px] w-full flex-col rounded-card border border-border bg-surface p-8 ${className}`}
    >
      <h2 className="text-row-title text-ink">최근 분실물</h2>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body text-muted">아직 등록된 분실물이 없습니다.</p>
      </div>
    </div>
  );
}
