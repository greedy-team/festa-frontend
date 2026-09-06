import { describe, expect, it } from "vitest";
import { rowKey, rowName } from "./PreviewPanel";
import type { ImportPreviewRow } from "@/features/admin/import/types";

function row(overrides: Partial<ImportPreviewRow> = {}): ImportPreviewRow {
  return {
    section: "FESTIVALS",
    line: 7,
    importKey: null,
    action: "CREATE",
    values: {},
    matchedHostId: null,
    matchedArtistId: null,
    matchedFestivalId: null,
    artistMatchStatus: null,
    errors: [],
    warnings: [],
    skipReason: null,
    ...overrides,
  } as ImportPreviewRow;
}

describe("rowKey", () => {
  it("구역과 줄 번호를 묶어 행을 가른다", () => {
    expect(rowKey(row({ section: "LINEUPS", line: 3 }))).toBe("LINEUPS:3");
  });

  it("줄 번호가 같아도 구역이 다르면 다른 키다 — 한 파일에 여러 구역이 온다", () => {
    expect(rowKey(row({ section: "FESTIVALS", line: 1 }))).not.toBe(
      rowKey(row({ section: "ARTISTS", line: 1 })),
    );
  });
});

// 폴백 체인은 순서가 곧 계약이다. CSV 헤더가 타입마다 달라
// festivals·artists는 name, lineups는 artist_canonical을 쓴다.
describe("rowName", () => {
  it("name이 있으면 name이다", () => {
    expect(rowName(row({ values: { name: "아카라카", artist_canonical: "PSY" } }))).toBe(
      "아카라카",
    );
  });

  it("name이 없으면 artist_canonical로 내려간다 — 라인업 CSV의 헤더", () => {
    expect(rowName(row({ section: "LINEUPS", values: { artist_canonical: "PSY" } }))).toBe("PSY");
  });

  it("둘 다 없으면 importKey로 내려간다", () => {
    expect(rowName(row({ values: {}, importKey: "yonsei-2026" }))).toBe("yonsei-2026");
  });

  it("아무것도 없으면 줄 번호로 자리를 만든다 — 빈 칸을 남기지 않는다", () => {
    expect(rowName(row({ line: 42, values: {}, importKey: null }))).toBe("42행");
  });

  it("values가 통째로 없어도 던지지 않는다", () => {
    // 타입상 필수지만 백엔드가 빠뜨릴 수 있어 코드가 ?? {}로 방어한다.
    expect(rowName(row({ values: undefined as unknown as ImportPreviewRow["values"] }))).toBe(
      "7행",
    );
  });

  it("값이 null이면 다음 단계로 내려간다 — CSV 빈 칸이 null로 온다", () => {
    expect(rowName(row({ values: { name: null }, importKey: "키" }))).toBe("키");
  });
});
