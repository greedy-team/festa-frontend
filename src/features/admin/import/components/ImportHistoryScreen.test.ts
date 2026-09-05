import { describe, expect, it } from "vitest";
import { formatDateTime, parseStatus, parseType } from "./ImportHistoryScreen";

describe("parseType", () => {
  it("명세에 있는 임포트 종류는 그대로 통과시킨다", () => {
    expect(parseType("BUNDLE")).toBe("BUNDLE");
    expect(parseType("FESTIVALS")).toBe("FESTIVALS");
    expect(parseType("LINEUPS")).toBe("LINEUPS");
    expect(parseType("ARTISTS")).toBe("ARTISTS");
  });

  it("명세 밖 값과 null은 undefined다", () => {
    expect(parseType("HOSTS")).toBeUndefined();
    expect(parseType("bundle")).toBeUndefined();
    expect(parseType(null)).toBeUndefined();
  });
});

describe("parseStatus", () => {
  it("명세에 있는 상태는 그대로 통과시킨다", () => {
    expect(parseStatus("PENDING")).toBe("PENDING");
    expect(parseStatus("COMMITTED")).toBe("COMMITTED");
    expect(parseStatus("EXPIRED")).toBe("EXPIRED");
  });

  it("명세 밖 값과 null은 undefined다", () => {
    expect(parseStatus("FAILED")).toBeUndefined();
    expect(parseStatus(null)).toBeUndefined();
  });
});

// 포맷 결과 자체는 단언하지 않는다 — toLocaleString("ko-KR")은 실행 환경의
// ICU 데이터에 따라 문자열이 갈려서, 값을 못박으면 CI에서 환경 때문에 깨진다.
// 여기서 계약인 것은 "값이 없거나 깨졌으면 —" 쪽이다.
describe("formatDateTime", () => {
  it("값이 없으면 —로 떨어진다", () => {
    expect(formatDateTime(null)).toBe("—");
  });

  it("날짜로 읽을 수 없는 값도 —로 떨어진다 — Invalid Date를 화면에 내지 않는다", () => {
    // new Date("깨진 값")은 던지지 않고 Invalid Date를 만든다. 그대로
    // toLocaleString하면 화면에 "Invalid Date"가 찍힌다.
    expect(formatDateTime("깨진 값")).toBe("—");
    expect(formatDateTime("")).toBe("—");
  });

  it("정상 ISO 문자열은 사람이 읽는 형태로 바뀐다 — 원본을 그대로 내보내지 않는다", () => {
    const iso = "2026-09-05T12:34:56Z";
    const formatted = formatDateTime(iso);

    expect(formatted).not.toBe("—");
    // 원본을 그대로 돌려줘도 통과하던 자리다. 로케일·타임존이 달라도 안 바뀌는 것만
    // 고정한다 — 연도는 UTC±14 어디서도 2026이고 ko-KR은 그레고리력이다.
    expect(formatted).not.toBe(iso);
    expect(formatted).toContain("2026");
  });
});
