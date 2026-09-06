import { describe, expect, it } from "vitest";
import { hostnameOf } from "./FestivalReviewTable";

// 크롤러가 긁어온 sourceUrl을 표에 도메인만 줄여 보여주는 자리.
// new URL은 이상한 값에 던지는데, 행 렌더 안이라 그대로 두면 행 하나가
// 표 전체를 무너뜨린다. 그래서 폴백이 있고, 그 폴백을 여기서 잰다.
describe("hostnameOf", () => {
  it("정상 URL은 호스트만 남긴다", () => {
    expect(hostnameOf("https://www.yonsei.ac.kr/festival/2026")).toBe("www.yonsei.ac.kr");
    expect(hostnameOf("http://blog.naver.com/post?id=1")).toBe("blog.naver.com");
  });

  it("포트와 인증 정보가 붙어도 호스트만 남긴다", () => {
    expect(hostnameOf("https://example.com:8443/path")).toBe("example.com");
  });

  it("파싱할 수 없는 값은 원본을 그대로 돌려준다 — 던지지 않는다", () => {
    // 던지면 행 하나가 표 전체를 무너뜨린다.
    expect(() => hostnameOf("그냥 문자열")).not.toThrow();
    expect(hostnameOf("그냥 문자열")).toBe("그냥 문자열");
    expect(hostnameOf("")).toBe("");
    expect(hostnameOf("//scheme-relative.example")).toBe("//scheme-relative.example");
  });
});
