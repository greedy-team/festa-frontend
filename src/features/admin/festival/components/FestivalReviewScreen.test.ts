import { describe, expect, it } from "vitest";
import { parseDiscovery, parsePublished } from "./FestivalReviewScreen";

// 검수 화면의 필터 상태는 URL에 산다. 주소창은 사용자가 손으로 고칠 수 있는
// 입력이라, 이상한 값이 와도 화면이 깨지지 않고 "필터 없음"으로 떨어져야 한다.
// parsePage·enumOrNull과 같은 계열이다.
describe("parsePublished", () => {
  it("true·false 문자열만 불리언으로 읽는다", () => {
    expect(parsePublished("true")).toBe(true);
    expect(parsePublished("false")).toBe(false);
  });

  it("값이 없으면 undefined다 — 필터를 걸지 않는다는 뜻", () => {
    // undefined는 "필터 없음"이고 false는 "미발행만"이다. 둘이 뭉개지면
    // 필터를 안 건 화면이 미발행만 보여준다.
    expect(parsePublished(null)).toBeUndefined();
  });

  it("불리언으로 읽을 수 없는 값은 undefined다", () => {
    expect(parsePublished("TRUE")).toBeUndefined();
    expect(parsePublished("1")).toBeUndefined();
    expect(parsePublished("")).toBeUndefined();
    expect(parsePublished("아무거나")).toBeUndefined();
  });
});

describe("parseDiscovery", () => {
  it("명세에 있는 값은 그대로 통과시킨다", () => {
    expect(parseDiscovery("SITEMAP")).toBe("SITEMAP");
    expect(parseDiscovery("MANUAL")).toBe("MANUAL");
    expect(parseDiscovery("SEARCH")).toBe("SEARCH");
  });

  it("명세 밖 값과 null은 undefined다", () => {
    // PASTED는 ERD엔 있지만 API 명세엔 없는 값이다 (adminEnums.ts 주석).
    // 사전에 없으면 필터로 쓰지 않는다.
    expect(parseDiscovery("PASTED")).toBeUndefined();
    expect(parseDiscovery("sitemap")).toBeUndefined();
    expect(parseDiscovery(null)).toBeUndefined();
  });
});
