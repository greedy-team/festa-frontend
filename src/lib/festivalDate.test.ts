import { describe, expect, it } from "vitest";
import {
  dDay,
  dateRange,
  dateWithWeekday,
  festivalSeason,
  festivalStatus,
  formatDday,
  fullDate,
} from "./festivalDate";

describe("formatDday", () => {
  it("양수면 D-N, 0이면 D-DAY, 음수면 D+N", () => {
    expect(formatDday(3)).toBe("D-3");
    expect(formatDday(0)).toBe("D-DAY");
    expect(formatDday(-5)).toBe("D+5");
  });
});

describe("dDay", () => {
  // 시스템 시간(오늘)에 따라 값이 흔들리지 않게, today를 항상 명시적으로 넘긴다.
  it("시작일이 미래면 남은 일수만큼 D-N을 낸다", () => {
    expect(dDay("2026-09-10", "2026-09-07")).toBe("D-3");
  });

  it("시작일이 오늘이면 D-DAY", () => {
    expect(dDay("2026-09-07", "2026-09-07")).toBe("D-DAY");
  });

  it("시작일이 과거면 지난 일수만큼 D+N", () => {
    expect(dDay("2026-09-01", "2026-09-07")).toBe("D+6");
  });

  it("월 경계를 넘어가도 정확히 계산한다", () => {
    expect(dDay("2026-10-01", "2026-09-29")).toBe("D-2");
  });
});

describe("fullDate", () => {
  it("하이픈을 점으로 바꾼다", () => {
    expect(fullDate("2026-05-23")).toBe("2026.05.23");
  });
});

describe("dateRange", () => {
  it("연도를 빼고 월.일만 물결로 잇는다", () => {
    expect(dateRange("2026-08-19", "2026-08-21")).toBe("08.19 ~ 08.21");
  });

  it("월이 걸쳐 있어도 각자의 월.일을 그대로 보여준다", () => {
    expect(dateRange("2026-08-30", "2026-09-02")).toBe("08.30 ~ 09.02");
  });
});

describe("festivalSeason", () => {
  it("1~6월은 봄", () => {
    expect(festivalSeason("2026-01-01")).toBe("2026년 봄");
    expect(festivalSeason("2026-06-30")).toBe("2026년 봄");
  });

  it("7~12월은 가을", () => {
    expect(festivalSeason("2026-07-01")).toBe("2026년 가을");
    expect(festivalSeason("2026-12-31")).toBe("2026년 가을");
  });
});

describe("festivalStatus", () => {
  it("오늘이 시작일보다 이르면 UPCOMING", () => {
    expect(festivalStatus("2026-09-10", "2026-09-12", "2026-09-01")).toBe("UPCOMING");
  });

  it("오늘이 기간 안이면 ONGOING (시작일 당일 포함)", () => {
    expect(festivalStatus("2026-09-10", "2026-09-12", "2026-09-10")).toBe("ONGOING");
    expect(festivalStatus("2026-09-10", "2026-09-12", "2026-09-11")).toBe("ONGOING");
  });

  it("오늘이 종료일보다 늦으면 ENDED (종료일 당일은 아직 ONGOING)", () => {
    expect(festivalStatus("2026-09-10", "2026-09-12", "2026-09-12")).toBe("ONGOING");
    expect(festivalStatus("2026-09-10", "2026-09-12", "2026-09-13")).toBe("ENDED");
  });
});

describe("dateWithWeekday", () => {
  it("월.일과 요일을 함께 보여준다", () => {
    expect(dateWithWeekday("2026-05-30")).toBe("05.30(토)");
    expect(dateWithWeekday("2026-01-01")).toBe("01.01(목)");
  });
});
