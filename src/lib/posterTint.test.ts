import { describe, expect, it } from "vitest";
import { gridTint, heroTint, nameTint } from "./posterTint";

describe("heroTint", () => {
  it("같은 id는 항상 같은 틴트를 낸다", () => {
    expect(heroTint(21)).toBe(heroTint(21));
  });

  it("4종 팔레트 안에서 순환한다", () => {
    expect(heroTint(0)).toBe("bg-hero-1");
    expect(heroTint(4)).toBe("bg-hero-1");
    expect(heroTint(1)).toBe("bg-hero-2");
  });

  it("음수 id도 절댓값 기준으로 같은 틴트를 낸다", () => {
    expect(heroTint(-3)).toBe(heroTint(3));
  });
});

describe("gridTint", () => {
  it("같은 id는 항상 같은 틴트를 낸다", () => {
    expect(gridTint(52)).toBe(gridTint(52));
  });

  it("5종 팔레트 안에서 순환한다", () => {
    expect(gridTint(0)).toBe("bg-grid-1");
    expect(gridTint(5)).toBe("bg-grid-1");
  });

  it("음수 id도 절댓값 기준으로 같은 틴트를 낸다", () => {
    expect(gridTint(-2)).toBe(gridTint(2));
  });
});

describe("nameTint", () => {
  it("같은 이름은 항상 같은 색을 낸다(순수 함수)", () => {
    expect(nameTint("아이유")).toBe(nameTint("아이유"));
    expect(nameTint("잔나비")).toBe(nameTint("잔나비"));
  });

  it("5종 그리드 팔레트 안의 값만 낸다", () => {
    const palette = ["bg-grid-1", "bg-grid-2", "bg-grid-3", "bg-grid-4", "bg-grid-5"];
    expect(palette).toContain(nameTint("10CM"));
    expect(palette).toContain(nameTint(""));
  });
});
