/**
 * 관리자 임포트 API. adminFetch가 인증 헤더·에러 계약을 전담한다.
 *
 * 업로드는 multipart다 — FormData를 그대로 body에 넣고 Content-Type을 손으로
 * 넣지 않는다. 브라우저가 boundary 붙은 헤더를 만든다 (직접 넣으면 boundary가
 * 빠져 서버가 파싱하지 못한다). adminFetch는 호출부가 준 헤더만 얹으므로 그대로 쓴다.
 */
import { adminFetch } from "@/lib/adminFetch";
import type { PageResponse } from "@/types/api";
import type {
  ImportCommitResult,
  ImportHistoryItem,
  ImportPreview,
  ImportSection,
  ImportStatus,
  ImportType,
  OnConflict,
} from "@/features/admin/import/types";

export type BundleUpload = {
  festivals: File;
  lineups: File;
  artists: File | null;
  onConflict: OnConflict;
};

/** POST /admin/imports/bundle — festivals·lineups 필수, artists 선택 */
export async function uploadBundle(upload: BundleUpload): Promise<ImportPreview> {
  const form = new FormData();
  form.set("festivals", upload.festivals);
  form.set("lineups", upload.lineups);
  if (upload.artists) form.set("artists", upload.artists);
  form.set("onConflict", upload.onConflict);

  return adminFetch<ImportPreview>("/admin/imports/bundle", {
    method: "POST",
    body: form,
  });
}

/**
 * POST /admin/imports/{importId}/commit — 행 단위 선택 커밋.
 * lines는 { 섹션(소문자 아님 — 스펙상 자유 키): line[] }이며 미리보기 행의
 * section·line을 그대로 되보낸다.
 */
export async function commitImport(
  importId: number,
  lines: Partial<Record<ImportSection, number[]>>,
): Promise<ImportCommitResult> {
  return adminFetch<ImportCommitResult>(`/admin/imports/${importId}/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines }),
  });
}

export type HistoryParams = {
  type?: ImportType;
  status?: ImportStatus;
  /** 0-based */
  page: number;
  size: number;
};

/** GET /admin/imports — 최신 업로드 순 */
export async function getImportHistory(
  params: HistoryParams,
): Promise<PageResponse<ImportHistoryItem>> {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.status) qs.set("status", params.status);
  qs.set("page", String(params.page));
  qs.set("size", String(params.size));
  return adminFetch<PageResponse<ImportHistoryItem>>(`/admin/imports?${qs.toString()}`);
}
