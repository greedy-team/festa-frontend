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

  it("1 이상인 소수는 버림해서 정수 페이지로 사용한다", () => {
    expect(parsePage("2.5")).toBe(2);
    expect(parsePage("3.9")).toBe(3);
  });

  it("1 미만인 소수는 1로 접는다", () => {
    expect(parsePage("0.5")).toBe(1);
  });
});
