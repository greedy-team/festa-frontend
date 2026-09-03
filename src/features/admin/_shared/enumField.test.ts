import { describe, expect, it } from "vitest";
import { enumOrNull } from "./enumField";

describe("enumOrNull", () => {
  it('빈 선택은 null이다 — ""로 보내면 서버가 400을 낸다', () => {
    expect(enumOrNull("")).toBeNull();
  });

  it("값이 있으면 그대로 통과시킨다", () => {
    expect(enumOrNull("HIPHOP")).toBe("HIPHOP");
    expect(enumOrNull("FREE")).toBe("FREE");
  });

  it('공백만 있는 문자열은 그대로 둔다 — <select>가 낼 수 없는 값이라 여기서 다루지 않는다', () => {
    expect(enumOrNull(" ")).toBe(" ");
  });
});
