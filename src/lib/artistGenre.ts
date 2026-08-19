import type { ArtistGenre } from "@/features/artists/types";

// DEC-0081: 열거값은 영문 상수로 내려오고 표시 문구는 프론트가 갖는다.
export const GENRE_LABELS: Record<ArtistGenre, string> = {
  HIPHOP: "힙합",
  BALLAD_RNB: "발라드·R&B",
  BAND: "밴드",
  DANCE: "댄스",
};

export function genreLabel(genre: ArtistGenre | null): string {
  return (genre && GENRE_LABELS[genre]) || "장르 미상";
}
