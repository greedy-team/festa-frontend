/**
 * DEC-0041: 에러 응답은 errorCode·message·status·instance 네 필드다.
 * `message`는 개발자용이라 화면에 그대로 쓰지 않는다 — 콘솔로만 흘린다.
 * DEC-0042: 코드 하나가 사용자 문구 하나다.
 */
export class AdminApiError extends Error {
  readonly errorCode: string;
  readonly status: number;

  constructor(errorCode: string, status: number, devMessage = "") {
    super(devMessage || errorCode);
    this.name = "AdminApiError";
    this.errorCode = errorCode;
    this.status = status;
  }
}

/**
 * 화면이 이름으로 참조하는 에러 코드. DEC-0069에 따라 도메인 접두어로 갈린다.
 * 문자열을 화면 코드에 흩지 않기 위해 상수로 내보낸다.
 */
export const ADMIN_ERROR_CODE = {
  INVALID_CREDENTIALS: "ADMIN_INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  STORAGE_UNAVAILABLE: "ADMIN_STORAGE_UNAVAILABLE",
  /** 서버에 닿지 못했다. 서버가 준 코드가 아니라 클라이언트가 붙이는 값이다 */
  NETWORK: "ADMIN_NETWORK_ERROR",
  /** 실패했는데 본문에 errorCode가 없거나 파싱이 안 됐다 (프록시가 낸 HTML 등) */
  UNKNOWN: "ADMIN_UNKNOWN_ERROR",
  /** GET /admin/festivals의 page가 0 미만. 아직 이 코드를 쓰는 화면이 없다 — 목록 화면에서 소비 예정 */
  INVALID_PAGE: "INVALID_PAGE",
  /** GET /admin/festivals의 size가 허용 범위 밖 (서버 상한 50). 아직 이 코드를 쓰는 화면이 없다 — 목록 화면에서 소비 예정 */
  INVALID_PAGE_SIZE: "INVALID_PAGE_SIZE",
  /** POST/DELETE /admin/festivals/{id}/publish의 400 — 라인업이 비어 발행 불가 */
  FESTIVAL_PUBLISH_LINEUP_EMPTY: "FESTIVAL_PUBLISH_LINEUP_EMPTY",
  /** POST/DELETE /admin/festivals/{id}/publish의 400 — 주최가 연결되지 않아 발행 불가 */
  FESTIVAL_PUBLISH_HOST_NOT_LINKED: "FESTIVAL_PUBLISH_HOST_NOT_LINKED",
  /** POST/DELETE /admin/festivals/{id}/publish의 400 — 좌표 정보가 없어 발행 불가 */
  FESTIVAL_PUBLISH_COORDINATES_MISSING: "FESTIVAL_PUBLISH_COORDINATES_MISSING",
  /** POST/DELETE /admin/festivals/{id}/publish의 404 — 목록 조회 이후 삭제된 경우 등 */
  FESTIVAL_NOT_FOUND: "FESTIVAL_NOT_FOUND",
  ARTIST_INVALID_NAME: "ARTIST_INVALID_NAME",
  ARTIST_INVALID_ALIAS: "ARTIST_INVALID_ALIAS",
  ARTIST_DUPLICATE_NAME: "ARTIST_DUPLICATE_NAME",
  ARTIST_DUPLICATE_ALIAS: "ARTIST_DUPLICATE_ALIAS",
  ARTIST_HAS_APPEARANCES: "ARTIST_HAS_APPEARANCES",
  ARTIST_INVALID_TARGET_ID: "ARTIST_INVALID_TARGET_ID",
  ARTIST_INVALID_SOURCE_IDS: "ARTIST_INVALID_SOURCE_IDS",
  ARTIST_SELF_MERGE: "ARTIST_SELF_MERGE",
  ARTIST_NOT_FOUND: "ARTIST_NOT_FOUND",
  HOST_INVALID_NAME: "HOST_INVALID_NAME",
  HOST_INVALID_REGION: "HOST_INVALID_REGION",
  HOST_DUPLICATE_NAME: "HOST_DUPLICATE_NAME",
  HOST_HAS_FESTIVALS: "HOST_HAS_FESTIVALS",
  HOST_NOT_FOUND: "HOST_NOT_FOUND",
  INVALID_DATE_RANGE: "INVALID_DATE_RANGE",
  FESTIVAL_INVALID_NAME: "FESTIVAL_INVALID_NAME",
  FESTIVAL_INVALID_START_DATE: "FESTIVAL_INVALID_START_DATE",
  FESTIVAL_INVALID_END_DATE: "FESTIVAL_INVALID_END_DATE",
  FESTIVAL_INVALID_HOST_ID: "FESTIVAL_INVALID_HOST_ID",
  FESTIVAL_DUPLICATE_IMPORT_KEY: "FESTIVAL_DUPLICATE_IMPORT_KEY",
  FESTIVAL_PERIOD_CONFLICTS_LINEUP: "FESTIVAL_PERIOD_CONFLICTS_LINEUP",
  FESTIVAL_PUBLISHED_COORDINATES_REQUIRED: "FESTIVAL_PUBLISHED_COORDINATES_REQUIRED",
  FESTIVAL_ALREADY_PUBLISHED: "FESTIVAL_ALREADY_PUBLISHED",
  FESTIVAL_HAS_LINEUPS: "FESTIVAL_HAS_LINEUPS",
} as const;

const MESSAGES: Record<string, string> = {
  [ADMIN_ERROR_CODE.INVALID_CREDENTIALS]:
    "아이디 또는 비밀번호가 올바르지 않습니다.",
  // DEC-0086: 401은 두 종류로 갈려 온다. 프론트가 "재로그인"과 "토큰 이상"을
  // 가를 수 있어야 한다는 것이 그 결정의 이유이므로 합치지 않는다.
  [ADMIN_ERROR_CODE.TOKEN_EXPIRED]: "세션이 만료되었습니다. 다시 로그인해 주세요.",
  [ADMIN_ERROR_CODE.UNAUTHORIZED]: "인증이 필요합니다. 다시 로그인해 주세요.",
  [ADMIN_ERROR_CODE.STORAGE_UNAVAILABLE]:
    "브라우저 저장소를 사용할 수 없어 로그인 상태를 유지할 수 없습니다. 사이트 데이터 허용 여부를 확인하거나 시크릿 모드를 해제해 주세요.",
  [ADMIN_ERROR_CODE.NETWORK]:
    "서버에 연결할 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
  [ADMIN_ERROR_CODE.UNKNOWN]: "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  [ADMIN_ERROR_CODE.INVALID_PAGE]: "요청한 페이지 번호가 올바르지 않습니다.",
  [ADMIN_ERROR_CODE.INVALID_PAGE_SIZE]: "요청한 페이지 크기가 올바르지 않습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_PUBLISH_LINEUP_EMPTY]: "라인업이 없어 발행할 수 없습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_PUBLISH_HOST_NOT_LINKED]: "주최가 연결되지 않아 발행할 수 없습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_PUBLISH_COORDINATES_MISSING]: "좌표 정보가 없어 발행할 수 없습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_NOT_FOUND]:
    "해당 축제를 찾을 수 없습니다. 새로고침 후 다시 시도해 주세요.",
  [ADMIN_ERROR_CODE.ARTIST_INVALID_NAME]: "아티스트 이름을 입력해 주세요.",
  [ADMIN_ERROR_CODE.ARTIST_INVALID_ALIAS]: "별칭에 빈 값이나 중복이 있습니다.",
  [ADMIN_ERROR_CODE.ARTIST_DUPLICATE_NAME]:
    "이미 같은 이름의 아티스트가 있습니다. 이름이나 별칭과 겹칠 수 없습니다.",
  [ADMIN_ERROR_CODE.ARTIST_DUPLICATE_ALIAS]:
    "이미 같은 별칭이 있습니다. 다른 아티스트의 이름과도 겹칠 수 없습니다.",
  [ADMIN_ERROR_CODE.ARTIST_HAS_APPEARANCES]:
    "출연 이력이 있는 아티스트는 삭제할 수 없습니다. 병합을 검토해 주세요.",
  [ADMIN_ERROR_CODE.ARTIST_INVALID_TARGET_ID]: "남길 아티스트를 지정해 주세요.",
  [ADMIN_ERROR_CODE.ARTIST_INVALID_SOURCE_IDS]: "합칠 아티스트 선택이 올바르지 않습니다.",
  [ADMIN_ERROR_CODE.ARTIST_SELF_MERGE]: "같은 아티스트끼리는 병합할 수 없습니다.",
  [ADMIN_ERROR_CODE.ARTIST_NOT_FOUND]:
    "해당 아티스트를 찾을 수 없습니다. 새로고침 후 다시 시도해 주세요.",
  [ADMIN_ERROR_CODE.HOST_INVALID_NAME]: "주최 이름을 입력해 주세요.",
  [ADMIN_ERROR_CODE.HOST_INVALID_REGION]: "지역을 입력해 주세요.",
  [ADMIN_ERROR_CODE.HOST_DUPLICATE_NAME]: "이미 같은 이름의 주최가 있습니다.",
  [ADMIN_ERROR_CODE.HOST_HAS_FESTIVALS]:
    "축제가 등록된 주최는 삭제할 수 없습니다. 축제를 먼저 정리해 주세요.",
  [ADMIN_ERROR_CODE.HOST_NOT_FOUND]:
    "해당 주최를 찾을 수 없습니다. 새로고침 후 다시 시도해 주세요.",
  [ADMIN_ERROR_CODE.INVALID_DATE_RANGE]: "종료일이 시작일보다 빠를 수 없습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_INVALID_NAME]: "축제 이름을 입력해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_INVALID_START_DATE]: "시작일을 입력해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_INVALID_END_DATE]: "종료일을 입력해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_INVALID_HOST_ID]: "주최를 선택해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_DUPLICATE_IMPORT_KEY]:
    "이미 같은 임포트 키를 가진 축제가 있습니다.",
  [ADMIN_ERROR_CODE.FESTIVAL_PERIOD_CONFLICTS_LINEUP]:
    "줄인 기간 밖에 라인업이 남아 있습니다. 라인업 일차를 먼저 옮겨 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_PUBLISHED_COORDINATES_REQUIRED]:
    "발행된 축제는 좌표를 비울 수 없습니다. 먼저 발행을 해제해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_ALREADY_PUBLISHED]:
    "발행 중인 축제는 삭제할 수 없습니다. 먼저 발행을 해제해 주세요.",
  [ADMIN_ERROR_CODE.FESTIVAL_HAS_LINEUPS]:
    "라인업이 남아 있는 축제는 삭제할 수 없습니다. 라인업을 먼저 지워 주세요.",
};

/**
 * 모르는 코드는 코드를 괄호에 남긴다. 관리자 화면은 운영자가 보는 곳이라
 * 코드가 보이는 편이 제보에 유리하다.
 */
export function adminErrorMessage(errorCode: string): string {
  return MESSAGES[errorCode] ?? `처리 중 문제가 발생했습니다 (${errorCode})`;
}

/**
 * AdminApiError가 아닌 실패(네트워크 오류, 예상치 못한 예외)에 쓰는 문구.
 * 애초에 errorCode가 없으므로 adminErrorMessage의 "모르는 코드" 폴백처럼 코드를
 * 문구에 넣지 않는다 — 코드가 없던 실패에 `(UNKNOWN)`을 찍는 건 노이즈다.
 */
export const ADMIN_GENERIC_ERROR_MESSAGE =
  "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
