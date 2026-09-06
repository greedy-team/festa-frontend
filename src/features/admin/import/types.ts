/** POST /admin/imports/bundle · /{type} — api-docs.json `ImportPreviewResponse` 계열 */

export type ImportType = "BUNDLE" | "FESTIVALS" | "LINEUPS" | "ARTISTS";
export type ImportStatus = "PENDING" | "COMMITTED" | "EXPIRED";
export type OnConflict = "UPDATE" | "SKIP";
export type ImportSection = "FESTIVALS" | "LINEUPS" | "ARTISTS";
export type RowAction = "CREATE" | "UPDATE" | "SKIP" | "INVALID";

export type PreviewProblem = {
  code: string;
  message: string;
  blocker: boolean;
};

export type ImportPreviewRow = {
  section: ImportSection;
  line: number;
  importKey: string | null;
  action: RowAction;
  /** CSV 원본 값들 — 컬럼 구성이 타입마다 달라 자유 객체로 받는다 */
  values: Record<string, string | null>;
  matchedHostId: number | null;
  matchedArtistId: number | null;
  matchedFestivalId: number | null;
  artistMatchStatus: "MATCHED" | "NEW" | "UNRESOLVED" | null;
  errors: PreviewProblem[];
  warnings: PreviewProblem[];
  skipReason: string | null;
};

export type ImportPreview = {
  importId: number;
  type: ImportType;
  onConflict: OnConflict;
  uploadedAt: string;
  /** 업로드 후 30분 — 지나면 커밋이 IMPORT_EXPIRED로 거부된다 */
  expiresAt: string;
  summary: {
    total: number;
    toCreate: number;
    toUpdate: number;
    toSkip: number;
    invalid: number;
  };
  blockers: { code: string; count: number; values: string[] }[];
  rows: ImportPreviewRow[];
};

type SectionCounts = { created: number; updated: number; skipped: number };

export type ImportCommitResult = {
  importId: number;
  committedAt: string;
  result: Record<
    "artists" | "festivals" | "lineups",
    SectionCounts & { failed: number }
  >;
  createdFestivalIds: number[];
};

export type ImportHistoryItem = {
  importId: number;
  type: ImportType;
  fileNames: string[];
  status: ImportStatus;
  uploadedBy: string | null;
  uploadedAt: string;
  expiresAt: string;
  committedAt: string | null;
  result: Record<"artists" | "festivals" | "lineups", SectionCounts> | null;
};
