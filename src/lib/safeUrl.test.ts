import { describe, expect, it } from "vitest";
import { safeHttpUrl } from "./safeUrl";

describe("safeHttpUrl", () => {
  it("http(s) URL은 그대로 반환한다", () => {
    expect(safeHttpUrl("https://ok.example")).toBe("https://ok.example");
    expect(safeHttpUrl("http://ok.example")).toBe("http://ok.example");
  });

  it("스킴 대소문자와 무관하게 통과시킨다", () => {
    expect(safeHttpUrl("HTTPS://ok.example")).toBe("HTTPS://ok.example");
  });

  it("javascript: 스킴은 null로 막는다", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("JavaScript:alert(1)")).toBeNull();
  });

  it("http(s)://가 맨 앞이 아니라 문자열 어딘가에 있어도 막는다", () => {
    // 정규식의 ^ 앵커가 빠지면(예: /https?:\/\//i) 이 케이스만 통과해버린다 —
    // "차단해야 할" 값 안에 http(s)://가 섞여 있는 유일한 테스트라 앵커
    // 회귀를 여기서 잡는다.
    expect(safeHttpUrl("javascript:alert('https://ok.example')")).toBeNull();
  });

  it("data: 스킴은 null로 막는다", () => {
    expect(safeHttpUrl("data:text/html,<script>")).toBeNull();
  });

  it("프로토콜 상대 URL은 null로 막는다", () => {
    expect(safeHttpUrl("//evil.com")).toBeNull();
  });
});
