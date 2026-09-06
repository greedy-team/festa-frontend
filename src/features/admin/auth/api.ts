import { adminFetch } from "@/lib/adminFetch";

/** DEC-0085: POST /admin/auth/login → { accessToken, expiresIn }. expiresIn은 초. */
export type LoginResponse = { accessToken: string; expiresIn: number };

// DEC-0099가 DEC-0084(접두사 없음)를 대체했다 — /api는 API_BASE가 붙이고
// (lib/api.ts) adminFetch가 그 값을 쓴다. 여기서 다시 붙이지 않는다.
const LOGIN_PATH = "/admin/auth/login";

/** 관리자 로그인. 실패 시 AdminApiError를 throw한다 (adminFetch 계약) */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return adminFetch<LoginResponse>(LOGIN_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}
