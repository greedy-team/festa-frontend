import { describe, expect, it } from "vitest";
import { parsePage } from "./searchParams";

describe("parsePage", () => {
  it("undefined·null이면 1페이지로 취급한다", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage(null)).toBe(1);
  });

  it("일반적인 페이지 번호는 그대로 숫자로 읽는다", () => {
    expect(parsePage("1")).toBe(1);
    expect(parsePage("3")).toBe(3);
  });

  it("비숫자 문자열은 1로 접는다", () => {
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("")).toBe(1);
  });

  it("0 이하 값은 1로 접는다", () => {
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
  });

  // 함수 주석은 "1 미만·소수·비숫자를 전부 1로 접는다"고 적혀 있지만, 실제로는
  // Math.floor가 먼저 적용돼 1 이상인 소수는 내림된 정수로 살아남는다
  // (예: "2.5" → 2). 코드가 실제로 하는 일을 테스트로 고정해둔다 — 주석 쪽을
  // 고칠지는 별도로 판단할 문제라 여기서 임의로 바꾸지 않는다.
  it("1 이상인 소수는 버림해서 정수 페이지로 사용한다(주석의 설명과 다름)", () => {
    expect(parsePage("2.5")).toBe(2);
    expect(parsePage("3.9")).toBe(3);
  });

  it("1 미만인 소수는 1로 접는다", () => {
    expect(parsePage("0.5")).toBe(1);
  });
});
