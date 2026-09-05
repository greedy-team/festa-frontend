import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearToken, readToken, writeToken } from "./token";

const KEY = "festa.admin.accessToken";

/** localStorage 접근이 던지는 브라우저(저장소를 막은 프로필 등)를 흉내낸다. */
const throwingStorage = {
  getItem: () => {
    throw new DOMException("The operation is insecure.", "SecurityError");
  },
  setItem: () => {
    throw new DOMException("The operation is insecure.", "SecurityError");
  },
  removeItem: () => {
    throw new DOMException("The operation is insecure.", "SecurityError");
  },
};

beforeEach(() => {
  // 실패 경로가 console.error를 부른다 — 테스트 출력이 에러로 뒤덮이지 않게 막는다.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("readToken", () => {
  it("서버 렌더 중(window 없음)에는 null이다", () => {
    // vitest environment가 node라 window가 애초에 없다 — 서버 렌더와 같은 조건.
    expect(readToken()).toBeNull();
  });

  it("저장된 토큰을 그대로 읽는다", () => {
    const store = new Map([[KEY, "eyJhbGciOi.stub"]]);
    vi.stubGlobal("window", {
      localStorage: { getItem: (k: string) => store.get(k) ?? null },
    });

    expect(readToken()).toBe("eyJhbGciOi.stub");
  });

  it("저장된 값이 없으면 null이다", () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => null } });

    expect(readToken()).toBeNull();
  });

  it("localStorage 접근이 던져도 null을 돌려준다 — 던지면 관리자 콘솔이 막다른 길이 된다", () => {
    vi.stubGlobal("window", { localStorage: throwingStorage });

    // AdminGuard의 useEffect에서 처리되지 않은 예외가 되면 로그인으로
    // 돌아갈 길이 없어진다. 그래서 잡아서 null로 떨어뜨린다.
    expect(() => readToken()).not.toThrow();
    expect(readToken()).toBeNull();
  });
});

describe("writeToken", () => {
  it("저장에 성공하면 true다", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: { setItem: (k: string, v: string) => void store.set(k, v) },
    });

    expect(writeToken("새토큰")).toBe(true);
    expect(store.get(KEY)).toBe("새토큰");
  });

  it("저장이 던지면 false다 — 호출자가 사용자에게 알릴 수 있게 결과로 돌려준다", () => {
    vi.stubGlobal("window", { localStorage: throwingStorage });

    expect(writeToken("새토큰")).toBe(false);
  });
});

describe("clearToken", () => {
  it("키를 지운다", () => {
    const store = new Map([[KEY, "지워질토큰"]]);
    vi.stubGlobal("window", {
      localStorage: { removeItem: (k: string) => void store.delete(k) },
    });

    clearToken();

    expect(store.has(KEY)).toBe(false);
  });

  it("삭제가 던져도 밖으로 새지 않는다 — 로그아웃이 예외로 멈추면 안 된다", () => {
    vi.stubGlobal("window", { localStorage: throwingStorage });

    expect(() => clearToken()).not.toThrow();
  });
});
