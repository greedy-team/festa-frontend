import { describe, expect, it } from "vitest";
import { formatOtherNames, parseOtherNames } from "./otherNames";

describe("parseOtherNames", () => {
  it("줄 단위로 가르고 앞뒤 공백을 버린다", () => {
    expect(parseOtherNames("  아이유 \n IU  ")).toEqual(["아이유", "IU"]);
  });

  it("빈 줄을 버린다 — 서버가 ARTIST_INVALID_ALIAS로 거절한다", () => {
    expect(parseOtherNames("아이유\n\n  \nIU\n")).toEqual(["아이유", "IU"]);
  });

  it("전부 비면 빈 배열이다 — DEC-0150에서 「별칭 전부 삭제」가 된다", () => {
    expect(parseOtherNames("   \n \n")).toEqual([]);
  });

  it("쉼표는 구분자가 아니다 — 이름에 들어갈 수 있다", () => {
    expect(parseOtherNames("Tyler, The Creator")).toEqual(["Tyler, The Creator"]);
  });

  it("format과 parse는 왕복한다", () => {
    const names = ["아이유", "IU"];
    expect(parseOtherNames(formatOtherNames(names))).toEqual(names);
  });

  it("formatOtherNames는 null·undefined를 빈 문자열로 본다", () => {
    expect(formatOtherNames(null)).toBe("");
    expect(formatOtherNames(undefined)).toBe("");
  });
});
