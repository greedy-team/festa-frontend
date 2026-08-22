const KEY = "festa.admin.accessToken";

// localStorage는 클라이언트에만 있다. 서버 렌더 중 호출되면 null을 준다.
// 접근 자체가 throw할 수도 있다 (SecurityError — 저장소를 막은 브라우저 프로필 등).
// 잡지 않으면 AdminGuard의 useEffect에서 처리되지 않은 예외가 되어, 로그인으로
// 돌아갈 길 없이 관리자 콘솔이 막다른 길에 빠진다.
export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch (error) {
    console.error("localStorage 접근 실패", error);
    return null;
  }
}

/** 저장 성공 여부를 반환한다 — 호출자가 실패를 사용자에게 알릴지 판단할 수 있도록. */
export function writeToken(token: string): boolean {
  try {
    window.localStorage.setItem(KEY, token);
    return true;
  } catch (error) {
    console.error("localStorage 접근 실패", error);
    return false;
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch (error) {
    console.error("localStorage 접근 실패", error);
  }
}
