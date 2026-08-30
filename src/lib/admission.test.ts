import { describe, expect, it } from "vitest";
import {
  externalVisitorLabel,
  ticketTypeLabel,
  verificationLabel,
} from "./admission";
import type {
  ExternalVisitor,
  TicketType,
  Verification,
} from "@/features/festivals/types";

describe("externalVisitorLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(externalVisitorLabel("ALLOWED")).toBe("외부인 입장 가능");
    expect(externalVisitorLabel("CONDITIONAL")).toBe("조건부 가능");
    expect(externalVisitorLabel("DENIED")).toBe("외부인 입장 불가");
  });

  it("명세 밖 값이 와도 빈 칸 대신 안내 문구로 떨어진다", () => {
    expect(externalVisitorLabel("UNKNOWN" as ExternalVisitor)).toBe("안내 없음");
  });
});

describe("verificationLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(verificationLabel("NONE")).toBe("확인 없음");
    expect(verificationLabel("STUDENT_ID")).toBe("학생증 확인");
    expect(verificationLabel("PRE_BOOKING")).toBe("사전 예약 필요");
    expect(verificationLabel("INVITATION")).toBe("초대장 필요");
    expect(verificationLabel("OTHER")).toBe("기타 (안내 참고)");
  });

  it("명세 밖 값이 와도 안내 문구로 떨어진다", () => {
    expect(verificationLabel("UNKNOWN" as Verification)).toBe("안내 없음");
  });
});

describe("ticketTypeLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(ticketTypeLabel("FREE")).toBe("무료");
    expect(ticketTypeLabel("PAID")).toBe("유료");
  });

  it("명세 밖 값이 와도 안내 문구로 떨어진다", () => {
    expect(ticketTypeLabel("UNKNOWN" as TicketType)).toBe("안내 없음");
  });
});
