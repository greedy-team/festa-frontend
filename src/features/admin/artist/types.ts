import type { ArtistGenre } from "@/features/artists/types";

/**
 * GET /admin/artists items[] · GET /admin/artists/{id} — api-docs.json `ArtistResponse`.
 * 스키마에 required 지정이 없어 값이 비어 올 수 있는 필드는 null을 허용한다.
 */
export type AdminArtist = {
  artistId: number;
  name: string;
  otherNames: string[];
  genre: ArtistGenre | null;
  imageUrl: string | null;
  instagramUrl: string | null;
  appearanceCount: number;
  needsReview: boolean;
  createdAt: string;
};

/** Swagger: sort는 CREATED_DESC(기본) / APPEARANCES / NAME */
export const ARTIST_SORT = {
  CREATED_DESC: "CREATED_DESC",
  APPEARANCES: "APPEARANCES",
  NAME: "NAME",
} as const;

export type ArtistSort = (typeof ARTIST_SORT)[keyof typeof ARTIST_SORT];

export type ArtistListParams = {
  needsReview?: boolean;
  q?: string;
  genre?: ArtistGenre;
  sort?: ArtistSort;
  /** 0-based — API가 받는 그대로. size 상한 50은 서버가 강제한다 */
  page: number;
  size: number;
};

/**
 * 폼이 들고 있는 값. DEC-0141이 「수정 여부와 무관하게 전체를 되보낸다」로 정했으므로
 * 부분 전송을 하지 않는다 — 그래서 optional 필드가 없다.
 *
 * 빈 값은 빈 문자열이다 (DEC-0150). 빈 `<input>`·빈 `<select>`가 내는 값이 그대로
 * `""`라 폼 상태를 그대로 보내면 그것이 계약이 된다 — null 매핑 계층을 두지 않는다.
 */
export type ArtistFormValues = {
  name: string;
  otherNames: string[];
  genre: ArtistGenre | "";
  instagramUrl: string;
  needsReview: boolean;
};

export type ArtistMergeCandidate = {
  artistId: number;
  name: string;
  otherNames: string[];
  genre: ArtistGenre | null;
  appearanceCount: number;
  similarity: number;
  reasons: string[];
};

export type ArtistMergeCandidates = {
  source: {
    artistId: number;
    name: string;
    otherNames: string[];
    genre: ArtistGenre | null;
    appearanceCount: number;
  };
  candidates: ArtistMergeCandidate[];
};

/** POST /admin/artists/merge 응답 */
export type ArtistMergeResult = {
  targetId: number;
  name: string;
  mergedCount: number;
  movedAppearances: number;
  removedDuplicates: number;
  otherNames: string[];
  needsReview: boolean;
};
