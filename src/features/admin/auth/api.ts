import { adminFetch } from "@/lib/adminFetch";

/** DEC-0085: POST /admin/auth/login → { accessToken, expiresIn }. expiresIn은 초. */
export type LoginResponse = { accessToken: string; expiresIn: number };

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
