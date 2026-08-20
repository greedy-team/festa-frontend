/**
 * URL의 `page` 파라미터를 1-based 페이지 번호로 읽는다.
 *
 * 1 미만·소수·비숫자를 전부 1로 접는다 — `?page=2.5`나 `?page=abc`가 그대로 API로
 * 나가 400이 되는 것을 막는다.
 *
 * 서버 컴포넌트는 `searchParams.page`(string | undefined)를,
 * 클라이언트 컴포넌트는 `useSearchParams().get("page")`(string | null)를 넘기므로
 * 둘 다 받는다.
 */
export function parsePage(raw: string | undefined | null): number {
  return Math.max(1, Math.floor(Number(raw ?? "1")) || 1);
}
