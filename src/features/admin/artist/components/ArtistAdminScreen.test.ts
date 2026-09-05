import { describe, expect, it } from "vitest";
import { parseGenre, parseSort } from "./ArtistAdminScreen";
import { ARTIST_SORT } from "@/features/admin/artist/types";

describe("parseGenre", () => {
  it("명세에 있는 장르는 그대로 통과시킨다", () => {
    expect(parseGenre("HIPHOP")).toBe("HIPHOP");
    expect(parseGenre("BALLAD_RNB")).toBe("BALLAD_RNB");
    expect(parseGenre("BAND")).toBe("BAND");
    expect(parseGenre("DANCE")).toBe("DANCE");
  });

  it("명세 밖 값과 null은 undefined다 — 필터를 걸지 않는다", () => {
    expect(parseGenre("ROCK")).toBeUndefined();
    expect(parseGenre("hiphop")).toBeUndefined();
    expect(parseGenre(null)).toBeUndefined();
  });
});

describe("parseSort", () => {
  it("화면이 제공하는 정렬만 통과시킨다", () => {
    expect(parseSort("APPEARANCES")).toBe(ARTIST_SORT.APPEARANCES);
    expect(parseSort("NAME")).toBe(ARTIST_SORT.NAME);
  });

  it("모르는 값은 기본 정렬로 떨어진다 — undefined가 아니다", () => {
    // parseGenre와 갈리는 지점이다. 장르는 "필터 없음"이 성립하지만
    // 정렬은 없을 수 없어서 기본값이 있어야 한다.
    expect(parseSort(null)).toBe(ARTIST_SORT.CREATED_DESC);
    expect(parseSort("")).toBe(ARTIST_SORT.CREATED_DESC);
    expect(parseSort("RANDOM")).toBe(ARTIST_SORT.CREATED_DESC);
  });

  it("드롭다운에 없는 CREATED_DESC를 직접 넣어도 기본값으로 떨어진다", () => {
    // SORT_OPTIONS에 없는 값이라 find가 못 찾고 ?? 폴백이 같은 값을 낸다.
    expect(parseSort("CREATED_DESC")).toBe(ARTIST_SORT.CREATED_DESC);
  });
});
