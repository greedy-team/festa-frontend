import { API_BASE } from "@/lib/api";
import { ADMIN_ERROR_CODE, AdminApiError } from "@/lib/adminError";

/** DEC-0085: POST /admin/auth/login → { accessToken, expiresIn }. expiresIn은 초. */
export type LoginResponse = { accessToken: string; expiresIn: number };

/** DEC-0084: 경로에 `/api` 접두사를 붙이지 않는다. */
const LOGIN_PATH = "/admin/auth/login";

/**
 * 서버가 보내는 에러 본문. DEC-0041이 네 필드로 고정했고 `message`는 개발자용이다.
 * 응답이 이 형태가 아닐 수도 있으므로(프록시가 낸 HTML 등) 전부 optional로 받는다.
 */
type ErrorBody = { errorCode?: unknown };

/**
 * 관리자 로그인.
 *
 * 이 파일의 함수는 실패 시 **throw**한다 — `src/lib/api.ts`의 `fetchJson`이 쓰는
 * 비-throw `ApiResult` 규약과 반대다. 화면이 react-query로 상태를 받는데,
 * `queryFn`/`mutationFn`이 던져야만 `isError`가 서고 호출부가 `errorCode`로 분기할 수
 * 있기 때문이다. 공개 화면(`features/festivals|artists/api.ts`)의 규약을 여기 그대로
 * 가져오면 실패가 조용히 "빈 결과"로 렌더된다.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch (error) {
    // 서버에 닿지도 못한 경우(연결 실패·DNS·타임아웃). 자격 증명 문제가 아니므로
    // ADMIN_INVALID_CREDENTIALS로 뭉치지 않는다 — 화면이 원인을 잘못 말하게 된다.
    console.error(`POST ${LOGIN_PATH} 요청 실패`, error);
    throw new AdminApiError(ADMIN_ERROR_CODE.NETWORK, 0);
  }

  if (!response.ok) {
    // 본문 파싱은 실패할 수 있다 — 502가 HTML을 돌려주는 경우 등.
    const body: ErrorBody = await response.json().catch(() => ({}));
    const errorCode =
      typeof body.errorCode === "string"
        ? body.errorCode
        : ADMIN_ERROR_CODE.UNKNOWN;
    throw new AdminApiError(errorCode, response.status);
  }

  return (await response.json()) as LoginResponse;
}
