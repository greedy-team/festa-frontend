// 목 핸들러가 가로채는 값과 같아야 한다 (src/mocks/handlers/*.ts의 API 상수).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.festa.kr";

/**
 * 요청 결과. 성공과 실패를 한 값에 담아 호출부가 분기하게 한다.
 *
 * `status`는 서버가 응답을 준 경우의 HTTP 코드다. `null`이면 응답 자체가 없었다는
 * 뜻이다 (연결 실패·DNS·타임아웃). 404와 "결과 0건"이, 500과 "빈 목록"이 화면에서
 * 같아 보이면 안 된다.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number | null; message: string };

/**
 * 던지지 않는 fetch.
 *
 * 서버 컴포넌트가 그냥 `await fetch()`를 부르면 연결 실패가 그대로 렌더 에러가 되어
 * 화면 전체가 500으로 뜬다. 모킹 플래그는 로컬 전용이라 Vercel에 없고 실제 백엔드도
 * 아직 없어서 프리렌더가 매번 그 경로를 탄다.
 *
 * 그래서 예외 대신 결과값을 돌려준다. 실패를 삼키는 게 아니라 호출부로 넘긴다.
 */
export async function fetchJson<T>(path: string): Promise<ApiResult<T>> {
  // 응답이 온 뒤에 채워진다. null로 남으면 서버에 닿지도 못했다는 뜻이다.
  let status: number | null = null;

  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    status = res.status;

    if (!res.ok) {
      return { ok: false, status, message: `${res.status} ${res.statusText}` };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (error) {
    // 여기 왔는데 status가 차 있으면 응답은 왔고 본문 파싱이 깨진 것이다
    // (200인데 에러 페이지 HTML이 오는 경우 등).
    return {
      ok: false,
      status,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
