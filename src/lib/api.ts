import { MOCKING_ENABLED } from "@/lib/mocking";

// 목 핸들러가 가로채는 값과 같아야 한다 (src/mocks/handlers/*.ts의 API 상수).
// /api 접두사: 2026-08-23 백엔드 결정(DEC-0099)으로 모든 경로(공개·관리자)가
// /api 아래로 옮겨갔다. 여기 한 곳만 고치면 fetchJson을 쓰는 공개 화면과, 이
// 상수를 그대로 가져다 쓰는 features/admin/auth/api.ts에도 같이 반영된다.
export const API_BASE =
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.festa.kr"}/api`;

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
 * MOCKING_ENABLED일 때 실제 fetch 대신 쓴다.
 *
 * msw/node의 setupServer로 fetch를 가로채는 방식(src/instrumentation.ts)은 로컬
 * `next start`에서는 되지만 Vercel 서버리스 함수에서는 인터셉션이 안 걸린다
 * (#75). 그래서 네트워크를 아예 안 타고, MSW 핸들러의 RequestHandler.run()을
 * 직접 호출해 같은 handlers 배열로 응답을 만든다 — 실행 환경에 의존하지 않는다.
 */
async function fetchMockJson<T>(path: string): Promise<ApiResult<T>> {
  const { handlers } = await import("@/mocks/handlers");
  const request = new Request(`${API_BASE}${path}`);

  for (const handler of handlers) {
    const result = await handler.run({ request, requestId: crypto.randomUUID() });
    if (!result?.response) continue;

    const { response } = result;
    if (!response.ok) {
      return { ok: false, status: response.status, message: `${response.status} ${response.statusText}` };
    }
    return { ok: true, data: (await response.json()) as T };
  }

  return { ok: false, status: null, message: `모킹 핸들러 없음: ${path}` };
}

/**
 * 던지지 않는 fetch.
 *
 * 서버 컴포넌트가 그냥 `await fetch()`를 부르면 연결 실패가 그대로 렌더 에러가 되어
 * 화면 전체가 500으로 뜬다. 그래서 예외 대신 결과값을 돌려준다. 실패를 삼키는 게
 * 아니라 호출부로 넘긴다.
 */
export async function fetchJson<T>(path: string): Promise<ApiResult<T>> {
  if (MOCKING_ENABLED) {
    return fetchMockJson<T>(path);
  }

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
