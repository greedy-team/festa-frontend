import { describe, expect, it } from "vitest";
import {
  EMPTY_FESTIVAL_FORM,
  coordinateError,
  toDatetimeLocal,
  toFestivalRequestBody,
  toInstantIso,
} from "./festivalForm";

describe("coordinateError", () => {
  it("한쪽만 채우면 발행 여부와 무관하게 막는다 — 서버는 이 반쪽을 안 막는다", () => {
    expect(coordinateError("37.5", "", false)).not.toBeNull();
    expect(coordinateError("", "127.0", false)).not.toBeNull();
    expect(coordinateError("37.5", "", true)).not.toBeNull();
  });

  it("발행된 축제는 둘 다 비우는 것도 막는다 — 서버 409를 폼에서 미리 알린다", () => {
    expect(coordinateError("", "", true)).not.toBeNull();
  });

  it("미발행이면 둘 다 비워도 되고, 둘 다 채우면 언제나 된다", () => {
    expect(coordinateError("", "", false)).toBeNull();
    expect(coordinateError("37.5", "127.0", false)).toBeNull();
    expect(coordinateError("37.5", "127.0", true)).toBeNull();
  });
});

describe("Instant ↔ datetime-local 변환", () => {
  it("왕복한다 — 타임존과 무관하게 같은 시각으로 돌아온다", () => {
    const iso = "2026-05-20T09:30:00.000Z";
    expect(toInstantIso(toDatetimeLocal(iso))).toBe(iso);
  });

  it("초를 보존한다 — 분에서 끊으면 손 안 댄 폼 저장이 서버 값의 초를 지운다", () => {
    const iso = "2026-05-20T09:30:45.000Z";
    expect(toInstantIso(toDatetimeLocal(iso))).toBe(iso);
  });

  it("null과 깨진 값은 빈 문자열이다", () => {
    expect(toDatetimeLocal(null)).toBe("");
    expect(toDatetimeLocal("not-a-date")).toBe("");
  });
});

describe("toFestivalRequestBody", () => {
  const base = { ...EMPTY_FESTIVAL_FORM, hostId: "3", name: "축제", startDate: "2026-05-20", endDate: "2026-05-22" };

  it("숫자·시각·enum의 빈 값은 null로 나간다 — enum에 \"\"를 보내면 400이다", () => {
    const body = toFestivalRequestBody(base);
    expect(body.latitude).toBeNull();
    expect(body.longitude).toBeNull();
    expect(body.ticketOpenAt).toBeNull();
    expect(body.externalVisitor).toBeNull();
    expect(body.verification).toBeNull();
    expect(body.ticketType).toBeNull();
  });

  it("String의 빈 값은 \"\" 그대로 나간다 — 서버가 공백을 삭제로 읽는다", () => {
    const body = toFestivalRequestBody(base);
    expect(body.importKey).toBe("");
    expect(body.posterUrl).toBe("");
  });

  it("좌표와 hostId는 문자열이 아니라 숫자로 나간다 — 서버 coercion에 맡기지 않는다", () => {
    const body = toFestivalRequestBody({ ...base, latitude: "37.5", longitude: "127.0" });
    expect(body.hostId).toBe(3);
    expect(body.latitude).toBe(37.5);
    expect(body.longitude).toBe(127.0);
  });
});
