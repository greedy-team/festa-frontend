import { describe, expect, it } from "vitest";
import { isActiveRoute } from "./activeRoute";

describe("isActiveRoute", () => {
  it("정확히 일치하는 경로는 활성으로 판단한다", () => {
    expect(isActiveRoute("/festivals", "/festivals")).toBe(true);
  });

  it("하위 경로도 활성으로 판단한다", () => {
    expect(isActiveRoute("/festivals/12", "/festivals")).toBe(true);
  });

  it("접두어만 같고 슬래시 경계가 다른 경로는 오탐하지 않는다", () => {
    expect(isActiveRoute("/festivals-archive", "/festivals")).toBe(false);
  });

  it("관련 없는 경로는 활성이 아니다", () => {
    expect(isActiveRoute("/artists", "/festivals")).toBe(false);
  });
});
