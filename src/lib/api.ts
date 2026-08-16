// 목 핸들러가 가로채는 값과 같아야 한다 (src/mocks/handlers/*.ts의 API 상수).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.festa.kr";

/**
 * 실패를 흡수하는 fetch.
 *
 * 모킹 플래그는 로컬 전용이라 Vercel Preview/Production에는 없고, 실제 백엔드도
 * 아직 없다. 서버 컴포넌트가 그냥 await fetch()를 부르면 연결 실패가 그대로
 * 렌더 에러가 되어 화면이 500으로 뜬다.
 *
 * 여기서 삼켜 fallback을 돌려주면 화면은 빈 상태로 그려진다. 백엔드가 붙으면
 * 그대로 실데이터가 들어온다.
 */
export async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[api] ${path} → ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[api] ${path} 요청 실패`, error);
    return fallback;
  }
}
