import type { Admission } from "@/features/festivals/types";
import {
  EXTERNAL_VISITOR_LABELS,
  VERIFICATION_LABELS,
  TICKET_TYPE_LABELS,
} from "@/lib/admission";

type Props = {
  admission: Admission;
};

export function AdmissionInfo({ admission }: Props) {
  const { externalVisitor, verification, ticketType, ticketOpenAt, note } = admission;

  const rows = [
    { label: "외부인 입장", value: EXTERNAL_VISITOR_LABELS[externalVisitor] },
    { label: "신분 확인", value: VERIFICATION_LABELS[verification] },
    { label: "티켓", value: TICKET_TYPE_LABELS[ticketType] },
    {
      label: "예매 오픈",
      value: ticketOpenAt
        ? new Date(ticketOpenAt).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "미정",
    },
  ];

  return (
    <section>
      <h2 className="text-block-title text-ink">입장 안내</h2>
      <div className="mt-4 flex flex-col divide-y divide-divider rounded-card border border-border bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-6 py-4">
            <span className="text-caption-strong text-muted-soft">{row.label}</span>
            <span className="text-caption-strong text-ink">{row.value}</span>
          </div>
        ))}
      </div>
      {note ? <p className="mt-3 text-caption text-muted">{note}</p> : null}
    </section>
  );
}
