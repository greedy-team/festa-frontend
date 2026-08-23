import { API_BASE } from "@/lib/api";
import { ADMIN_ERROR_CODE, AdminApiError } from "@/lib/adminError";
import { readToken } from "@/features/admin/auth/token";

/**
 * 서버가 보내는 에러 본문. DEC-0041이 네 필드로 고정했고 `message`는 개발자용이다.
 * 응답이 이 형태가 아닐 수도 있으므로(프록시가 낸 HTML 등) 전부 optional로 받는다.
 */
type ErrorBody = { errorCode?: unknown };

/**
 * 관리자 API 전용 fetch. 인증 헤더 부착 · `/api` 접두사 · 에러 계약을 전담한다.
 *
 * 실패 시 **throw**한다 — TanStack Query는 `queryFn`/`mutationFn`이 던져야
 * `isError`가 선다. `src/lib/api.ts`의 던지지 않는 `ApiResult<T>`와 의도적으로 다르다.
 *
 * 경로 접두사 `/api`는 여기서만 붙인다 — 호출부는 `/admin/...`만 넘긴다. 백엔드가
 * 이 접두사를 두 번 뒤집었다(PR #28 제거 → PR #62 복원, DEC-0084 폐기). 다음에 또
 * 바뀌어도 고칠 곳이 한 곳이 되도록 여기에 모은다.
 *
 * 401 후속처리(토큰 삭제·로그인 복귀)는 여기 넣지 않는다 — 로그인 요청도 401을
 * 받기 때문에, 여기서 처리하면 로그인 실패가 로그인 화면으로 자기 자신을
 * 리다이렉트하게 된다. 그 처리는 TanStack Query만 거치는 `AdminProviders`의
 * `QueryCache`/`MutationCache` `onError`에 둔다 (로그인은 훅을 쓰지 않아 여기 안 걸린다).
 */
export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = readToken();
  const headers = new Headers(init.headers);
  // 로그인 요청(토큰이 없거나 만료된 상태로도 호출됨)에도 그대로 실려간다 — 의도적 단순화.
  // 백엔드가 로그인 엔드포인트에서 이 헤더를 무시하고 헤더 없을 때와 동일한 401을 내리는
  // 것을 전제로 한다. 그 동작이 바뀌면 여기서 로그인 경로를 분기해야 한다.
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const method = init.method ?? "GET";
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    // 서버에 닿지도 못한 경우(연결 실패·DNS·타임아웃).
    console.error(`${method} ${path} 요청 실패`, error);
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

  try {
    return (await response.json()) as T;
  } catch (error) {
    console.error(`${method} ${path} 응답 파싱 실패`, error);
    throw new AdminApiError(ADMIN_ERROR_CODE.UNKNOWN, response.status);
  }
}
