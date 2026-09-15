import { describe, expect, it } from "vitest";
import { analyticsIds, analyticsPage, analyticsReferrer } from "./analytics";

describe("분석 수집 경계", () => {
  it("정보 탐색 화면만 분류하고 임의의 경로나 문자열 ID는 전송하지 않는다", () => {
    for (const path of ["/", "/festivals", "/festivals/12", "/artists", "/artists/2", "/hosts/3", "/hosts/3/history", "/search"]) {
      expect(analyticsPage(path)?.page_location).toBe(`https://www.every-festa.com${path}`);
    }
    for (const path of ["/admin", "/admin/login", "/showcase", "/privacy", "/terms", "/copyright", "/unknown", "/festivals/email@example.com", "/hosts/0", "/search?q=secret", "/constructor", "/toString"]) {
      expect(analyticsPage(path)).toBeNull();
    }
  });

  it("유입 도메인만 남기고 검색어·토큰·자격 증명은 제거한다", () => {
    expect(analyticsReferrer("https://id:password@search.naver.com/search?q=private#token")).toBe("https://search.naver.com");
    expect(analyticsReferrer("javascript:alert(1)")).toBe("");
    expect(analyticsReferrer("")).toBe("");
  });

  it("누락되거나 스크립트로 삽입될 수 있는 ID는 로드하지 않는다", () => {
    expect(analyticsIds("G-2SF7H4F5FV", "yiqqighve5")).toEqual({ ga: "G-2SF7H4F5FV", clarity: "yiqqighve5" });
    expect(analyticsIds(undefined, "';alert(1)//")).toEqual({ ga: null, clarity: null });
  });
});
