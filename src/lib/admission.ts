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
