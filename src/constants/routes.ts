/** 관리자 콘솔 경로. 화면·가드·셸이 공유하므로 한 곳에서만 정의한다. */
export const ADMIN_ROUTE_PREFIX = "/admin";

export const ADMIN_ROUTES = {
  login: "/admin/login",
  imports: "/admin/imports",
  importHistory: "/admin/imports/history",
  festivals: "/admin/festivals",
  artists: "/admin/artists",
  hosts: "/admin/hosts",
  lostItems: "/admin/lost-items",
} as const;

/** 로그인 직후·`/admin` 진입 시 가는 곳 */
export const ADMIN_HOME = ADMIN_ROUTES.festivals;
