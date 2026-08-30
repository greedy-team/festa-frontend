import { describe, expect, it } from "vitest";
import { genreLabel } from "./artistGenre";
import type { ArtistGenre } from "@/features/artists/types";

describe("genreLabel", () => {
  it("명세에 있는 값은 한글 문구로 매핑한다", () => {
    expect(genreLabel("HIPHOP")).toBe("힙합");
    expect(genreLabel("BALLAD_RNB")).toBe("발라드·R&B");
    expect(genreLabel("BAND")).toBe("밴드");
    expect(genreLabel("DANCE")).toBe("댄스");
  });

  it("null이면 장르 미상으로 떨어진다", () => {
    expect(genreLabel(null)).toBe("장르 미상");
  });

  it("명세 밖 값이 와도 장르 미상으로 떨어진다", () => {
    expect(genreLabel("UNKNOWN" as ArtistGenre)).toBe("장르 미상");
  });
});
