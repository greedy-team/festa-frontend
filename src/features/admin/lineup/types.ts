/** POST·GET·PATCH /admin/festivals/{festivalId}/lineups — api-docs.json `LineupResponse` */
export type AdminLineup = {
  lineupId: number;
  festivalId: number;
  festivalName: string;
  /** null이면 시크릿 게스트다 — 별도 플래그가 없다 (DEC-0117) */
  artistId: number | null;
  artistName: string | null;
  day: number;
  displayOrder: number;
};

/**
 * 폼이 들고 있는 값. day·displayOrder는 필수(1 이상), artistId는 비우면 시크릿
 * 게스트다 — 체크박스를 따로 두지 않는다. 두면 DB(`artist_id` nullable 컬럼 하나)에
 * 담기지 않는 제3의 상태를 화면이 발명하게 된다 (DEC-0117).
 */
export type LineupFormValues = {
  artistId: string;
  day: string;
  displayOrder: string;
};
