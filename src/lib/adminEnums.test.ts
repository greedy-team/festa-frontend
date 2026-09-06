import { describe, expect, it } from "vitest";
import { discoveryLabel, publishBlockerLabel } from "./adminEnums";

describe("discoveryLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(discoveryLabel("SITEMAP")).toBe("사이트맵");
    expect(discoveryLabel("MANUAL")).toBe("수동");
    expect(discoveryLabel("SEARCH")).toBe("검색");
  });

  it("사전에 없는 값은 원본 코드를 그대로 보여준다", () => {
    // DOC-0007 #24: ERD엔 PASTED가 네 번째 값으로 있는데 API 명세는 3종만 정의한다.
    expect(discoveryLabel("PASTED")).toBe("PASTED");
  });
});

describe("publishBlockerLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(publishBlockerLabel("LINEUP_EMPTY")).toBe("라인업 없음");
    expect(publishBlockerLabel("HOST_NOT_LINKED")).toBe("주최 미연결");
  });

  it("미정의 사유는 원본 문자열을 그대로 보여준다", () => {
    expect(publishBlockerLabel("SOME_NEW_REASON")).toBe("SOME_NEW_REASON");
  });
});
