// 정책 문서 초안(`festa-brain` docs/legal/*.md)의 `{{운영자명}}` 같은 자리는
// 실제 운영 정보가 확정되기 전까지 값을 지어내지 않고 이 컴포넌트로 대신 표시한다.
// 여러 정책 페이지(저작권·이용약관·개인정보 처리방침)가 같은 표기를 공유한다.
type Props = {
  label: string;
};

export function PendingField({ label }: Props) {
  return <span className="text-muted">({label} 확정 전)</span>;
}
