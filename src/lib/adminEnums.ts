// DEC-0081: 열거값은 영문 상수로 내려오고 표시 문구는 프론트가 갖는다.

import type { PublishBlockerReason } from "@/features/admin/festival/types";

/** 축제를 어떻게 찾았는가. DOC-0007 기준 3종 — 필터 드롭다운 선택지로만 쓴다.
 * 응답값(AdminFestival.discovery)은 이 3종에 갇히지 않는다. */
export type Discovery = "SITEMAP" | "MANUAL" | "SEARCH";

export const DISCOVERY_LABELS: Record<Discovery, string> = {
  SITEMAP: "사이트맵",
  MANUAL: "수동",
  SEARCH: "검색",
};

// DOC-0007 #24: ERD엔 PASTED가 네 번째 값으로 있는데 API 명세는 3종만 정의한다 —
// 이 불일치는 미해결이다. 여기서 PASTED를 임의로 추가하지 않고, 사전에 없는 값은
// 원본 코드를 그대로 보여준다 (운영자 화면이라 낯선 값을 숨기지 않는 편이 낫다).
export function discoveryLabel(discovery: Discovery | string): string {
  return DISCOVERY_LABELS[discovery as Discovery] || discovery;
}

/**
 * DOC-0007 「발행 조건」실패 사유. features/admin/festival/types.ts의 PublishBlockerReason을
 * `import type`으로 가져와 키를 맞춘다 — types.ts도 이 파일의 Discovery를 `import type`으로만
 * 참조하므로(types.ts → adminEnums.ts) 타입 전용 import끼리는 컴파일 시 소거되어 런타임
 * 순환은 생기지 않는다. Record를 이 타입으로 좁혀두면 PUBLISH_BLOCKER 쪽 값이 바뀔 때
 * 여기서 키 누락으로 컴파일 에러가 나 라벨이 조용히 원본 코드로 주저앉는 것을 막는다.
 */
export const PUBLISH_BLOCKER_LABELS: Record<PublishBlockerReason, string> = {
  LINEUP_EMPTY: "라인업 없음",
  HOST_NOT_LINKED: "주최 미연결",
  COORDINATES_MISSING: "좌표 없음",
};

// 서버가 blockers[]에 프론트가 모르는 사유를 보낼 수도 있으므로, publishBlockerLabel은
// PublishBlockerReason보다 넓은 string을 받는다. discoveryLabel과 같은 폴백(사전에
// 없으면 원본을 그대로 보여준다)이 여기서는 선택이 아니라 필수다.
export function publishBlockerLabel(reason: string): string {
  return PUBLISH_BLOCKER_LABELS[reason as PublishBlockerReason] || reason;
}
