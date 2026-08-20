import type {
  ExternalVisitor,
  Verification,
  TicketType,
} from "@/features/festivals/types";

// 명세의 영문 상수는 표시하지 않는다 — 표시 문구는 프론트가 갖는다 (DEC-0081과 같은 원칙)
export const EXTERNAL_VISITOR_LABELS: Record<ExternalVisitor, string> = {
  ALLOWED: "외부인 입장 가능",
  CONDITIONAL: "조건부 가능",
  DENIED: "외부인 입장 불가",
};

export const VERIFICATION_LABELS: Record<Verification, string> = {
  NONE: "확인 없음",
  STUDENT_ID: "학생증 확인",
  PRE_BOOKING: "사전 예약 필요",
  INVITATION: "초대장 필요",
  OTHER: "기타 (안내 참고)",
};

export const TICKET_TYPE_LABELS: Record<TicketType, string> = {
  FREE: "무료",
  PAID: "유료",
};

// 백엔드가 명세 밖 값을 내려도 빈 칸 대신 안내 문구로 떨어진다 (genreLabel과 같은 원칙)
export function externalVisitorLabel(value: ExternalVisitor): string {
  return EXTERNAL_VISITOR_LABELS[value] ?? "안내 없음";
}

export function verificationLabel(value: Verification): string {
  return VERIFICATION_LABELS[value] ?? "안내 없음";
}

export function ticketTypeLabel(value: TicketType): string {
  return TICKET_TYPE_LABELS[value] ?? "안내 없음";
}
