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
  /** GET /admin/festivals의 page가 0 미만 */
  INVALID_PAGE: "INVALID_PAGE",
  /** GET /admin/festivals의 size가 허용 범위 밖 (서버 상한 50) */
  INVALID_PAGE_SIZE: "INVALID_PAGE_SIZE",
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
