import type { Discovery } from "@/lib/adminEnums";

/**
 * GET /admin/festivals items[] — 백엔드 PR #55 `FestivalReviewItem` 기준
 * (api-docs.json 대조 완료, 2026-08-24). `importKey`·`hostId`·`hostName`·
 * `discovery`·`importedAt`은 DDL상 nullable이다. `published: boolean`은
 * 없다 — `publishedAt: string | null`로 발행 여부를 판정한다 (DEC-0097).
 */
export type AdminFestival = {
  festivalId: number;
  importKey: string | null;
  name: string;
  hostId: number | null;
  hostName: string | null;
  startDate: string;
  endDate: string;
  publishedAt: string | null;
  /**
   * 유니온이 아니라 string이다 — 엔티티가 String, DB가 varchar, 쿼리는 완전일치일
   * 뿐이라 프론트가 값을 제한할 근거가 없다. 필터 드롭다운 선택지는 Discovery 3종을
   * 유지하되, 응답 값(이 필드)은 그중 하나가 아닐 수 있다(DOC-0007 #24 PASTED 불일치).
   */
  discovery: string | null;
  sourceUrl: string | null;
  lineupCount: number;
  importedAt: string | null;
  blockers: PublishBlockerReason[];
};

export type FestivalReviewParams = {
  published?: boolean;
  /** 필터 선택지는 3종으로 고정한다 — 응답값(AdminFestival.discovery)과 달리 좁혀도 된다 */
  discovery?: Discovery;
  q?: string;
  /** 0-based — API가 받는 그대로. size 상한 50은 서버가 강제한다 */
  page: number;
  size: number;
};

/**
 * DOC-0007 「발행 조건」이 드러낸 실패 사유. 서버가 목록 응답에서 행마다
 * blockers[]로 미리 채워 보낸다 — 프론트가 계산하지 않는다.
 */
export const PUBLISH_BLOCKER = {
  LINEUP_EMPTY: "LINEUP_EMPTY",
  HOST_NOT_LINKED: "HOST_NOT_LINKED",
  COORDINATES_MISSING: "COORDINATES_MISSING",
} as const;

export type PublishBlockerReason =
  (typeof PUBLISH_BLOCKER)[keyof typeof PUBLISH_BLOCKER];

// DEC-0081: 열거값은 영문 상수로 내려오고 표시 문구는 프론트가 갖는다 (adminEnums.ts).
export type ExternalVisitorPolicy = "ALLOWED" | "CONDITIONAL" | "DENIED";
export type VerificationMethod = "NONE" | "STUDENT_ID" | "PRE_BOOKING" | "INVITATION" | "OTHER";
export type TicketType = "FREE" | "PAID";

/**
 * GET /admin/festivals/{id} — api-docs.json `FestivalResponse` 22필드.
 * 검수 목록의 `AdminFestival`(FestivalReviewItem)과 다른 스키마다 — 목록에는
 * discovery·sourceUrl·importedAt이 있고, 상세에는 폼이 채울 본문 필드가 있다.
 */
export type AdminFestivalDetail = {
  festivalId: number;
  hostId: number | null;
  hostName: string | null;
  importKey: string | null;
  name: string;
  startDate: string;
  endDate: string;
  posterUrl: string | null;
  description: string | null;
  venueName: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  externalVisitor: ExternalVisitorPolicy | null;
  verification: VerificationMethod | null;
  ticketType: TicketType | null;
  ticketOpenAt: string | null;
  admissionNote: string | null;
  instagramUrl: string | null;
  publishedAt: string | null;
  lineupCount: number;
  blockers: PublishBlockerReason[];
};

/**
 * 폼이 들고 있는 값 — 전부 문자열이다. HTML 입력이 내는 값이 문자열이고,
 * DEC-0141에 따라 전체를 되보내므로 optional 필드가 없다. 요청으로 바뀔 때의
 * 타입별 규칙은 festivalForm.ts의 toFestivalRequestBody가 전담한다.
 */
export type FestivalFormValues = {
  /** PATCH에서도 필수다 — 미연결 축제는 수정하려면 주최부터 골라야 한다 */
  hostId: string;
  importKey: string;
  name: string;
  startDate: string;
  endDate: string;
  posterUrl: string;
  description: string;
  venueName: string;
  address: string;
  latitude: string;
  longitude: string;
  externalVisitor: ExternalVisitorPolicy | "";
  verification: VerificationMethod | "";
  ticketType: TicketType | "";
  ticketOpenAt: string;
  admissionNote: string;
  instagramUrl: string;
};

/** POST/DELETE /admin/festivals/{id}/publish 공통 응답 모양 */
export type FestivalPublishResponse = {
  festivalId: number;
  name: string;
  publishedAt: string;
};
