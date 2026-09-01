import { describe, expect, it } from "vitest";
import { toLineupRequestBody } from "./api";

describe("toLineupRequestBody", () => {
  it("artistId를 비우면 null이다 — 시크릿 게스트. 별도 플래그를 만들지 않는다", () => {
    expect(toLineupRequestBody({ artistId: "", day: "1", displayOrder: "2" })).toEqual({
      artistId: null,
      day: 1,
      displayOrder: 2,
    });
  });

  it("셋 다 숫자로 확정해 보낸다 — 서버 coercion에 맡기지 않는다", () => {
    expect(toLineupRequestBody({ artistId: "7", day: "2", displayOrder: "1" })).toEqual({
      artistId: 7,
      day: 2,
      displayOrder: 1,
    });
  });
});
