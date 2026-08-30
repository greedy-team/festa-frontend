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

  it("홈(href=\"/\")은 정확히 일치할 때만 활성이고, 다른 모든 경로에서 오탐하지 않는다", () => {
    // Header.tsx의 실제 첫 메뉴 입력값이다. startsWith(href)로만 짰다면
    // 모든 경로가 "/"로 시작해 홈이 항상 활성으로 오탐했을 것 — `${href}/`가
    // "//"가 되어 그 오탐을 막는 게 우연이 아니라 이 함수의 핵심 동작임을 못박는다.
    expect(isActiveRoute("/", "/")).toBe(true);
    expect(isActiveRoute("/festivals", "/")).toBe(false);
  });
});
