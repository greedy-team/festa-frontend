import type { Discovery } from "@/lib/adminEnums";

/**
 * GET /admin/festivals items[] — 노션 명세 확인 결과 12필드
 *
 * hostId/hostName은 null 허용. HOST_NOT_LINKED가 발행 차단 사유로 존재한다는
 * 사실에서 역으로 추론한 것이며, 볼트에 "필드가 nullable이다"라고 명시된 문장은
 * 없다 — 실제 API 연결 시 이 부분을 확인하고 진행할 것.
 */
export type AdminFestival = {
  festivalId: number;
  importKey: string;
  name: string;
  hostId: number | null;
  hostName: string | null;
  startDate: string;
  endDate: string;
  published: boolean;
  discovery: Discovery;
  sourceUrl: string | null;
  lineupCount: number;
  importedAt: string;
};

export type FestivalReviewParams = {
  published?: boolean;
  discovery?: Discovery;
  year?: number;
  q?: string;
  /** 0-based — API가 받는 그대로 */
  page: number;
  size: number;
};

/**
 * DOC-0007 「발행 조건」이 드러낸 실패 사유. 문자열을 코드에 흩지 않는다.
 * 위경도 조건은 목록 응답에 필드가 없어 프론트가 판정할 수 없다 — 서버가 failed[]로 준다.
 */
export const PUBLISH_BLOCKER = {
  LINEUP_EMPTY: "LINEUP_EMPTY",
  HOST_NOT_LINKED: "HOST_NOT_LINKED",
} as const;

export type PublishBlockerReason =
  (typeof PUBLISH_BLOCKER)[keyof typeof PUBLISH_BLOCKER];

export type PublishFailure = {
  festivalId: number;
  name: string;
  /** 서버는 프론트가 모르는 사유도 보낼 수 있으므로 string으로 받는다 */
  reason: string;
  message: string;
};

/** POST /admin/festivals/publish — 부분 성공 허용 */
export type BulkPublishResult = {
  requested: number;
  published: number;
  publishedIds: number[];
  failed: PublishFailure[];
};
