"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PreviewPanel, rowKey } from "@/features/admin/import/components/PreviewPanel";
import { useCommitImport, useUploadBundle } from "@/features/admin/import/queries";
import type {
  ImportCommitResult,
  ImportPreview,
  ImportPreviewRow,
  ImportSection,
  OnConflict,
} from "@/features/admin/import/types";
import { ADMIN_ROUTES } from "@/constants/routes";
import {
  ADMIN_GENERIC_ERROR_MESSAGE,
  AdminApiError,
  adminErrorMessage,
} from "@/lib/adminError";

const INPUT_CLASS =
  "h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink";

/**
 * 크롤링 임포트 — 업로드 → 미리보기 → 행 선택 커밋.
 *
 * 미리보기를 다시 조회하는 API가 없다 (GET /imports는 이력 요약뿐) — 업로드 응답을
 * 컴포넌트 상태로 들고 있는 것이 전부라, 새로고침하면 미리보기가 사라지고 다시
 * 업로드해야 한다. 서버의 미리보기 자체는 30분 살아 있지만 행 데이터를 되찾을
 * 경로가 없다. 목록 API가 생기면 이 제약도 풀린다.
 */
export function ImportScreen() {
  const [festivalsFile, setFestivalsFile] = useState<File | null>(null);
  const [lineupsFile, setLineupsFile] = useState<File | null>(null);
  const [artistsFile, setArtistsFile] = useState<File | null>(null);
  const [onConflict, setOnConflict] = useState<OnConflict>("UPDATE");

  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [committed, setCommitted] = useState<ImportCommitResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const upload = useUploadBundle();
  const commit = useCommitImport();

  function reportError(action: string, error: unknown) {
    // DEC-0041: message는 개발자용이라 콘솔로만 보낸다.
    console.error(`${action} 실패`, error);
    setErrorMessage(
      error instanceof AdminApiError
        ? adminErrorMessage(error.errorCode)
        : ADMIN_GENERIC_ERROR_MESSAGE,
    );
  }

  function handleUpload() {
    if (!festivalsFile || !lineupsFile) return;
    setErrorMessage(null);
    upload.mutate(
      { festivals: festivalsFile, lineups: lineupsFile, artists: artistsFile, onConflict },
      {
        onSuccess: (result) => {
          setPreview(result);
          setCommitted(null);
          // 기본 선택: 커밋 가능한 행 전부. INVALID·SKIP은 선택 불가라 애초에 뺀다.
          setSelected(
            new Set(
              result.rows
                .filter((row) => row.action === "CREATE" || row.action === "UPDATE")
                .map(rowKey),
            ),
          );
        },
        onError: (error) => reportError("업로드", error),
      },
    );
  }

  function handleToggle(row: ImportPreviewRow) {
    setSelected((prev) => {
      const next = new Set(prev);
      const key = rowKey(row);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleCommit() {
    if (!preview) return;
    setErrorMessage(null);
    // 선택 키(`section:line`)를 계약 형태 { section: line[] }로 되접는다.
    const lines: Partial<Record<ImportSection, number[]>> = {};
    for (const row of preview.rows) {
      if (!selected.has(rowKey(row))) continue;
      (lines[row.section] ??= []).push(row.line);
    }
    commit.mutate(
      { importId: preview.importId, lines },
      {
        onSuccess: (result) => {
          setCommitted(result);
          setPreview(null);
          setSelected(new Set());
        },
        onError: (error) => reportError("커밋", error),
      },
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-md text-ink">크롤링 임포트</h1>
        <Link
          href={ADMIN_ROUTES.importHistory}
          className="text-caption-strong text-primary underline"
        >
          임포트 이력
        </Link>
      </div>

      {committed ? (
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-caption-strong text-ink">커밋 완료</p>
          <ul className="mt-2 flex flex-col gap-1 text-label-regular text-muted">
            {(["festivals", "lineups", "artists"] as const).map((section) => {
              const r = committed.result[section];
              return (
                <li key={section}>
                  {section}: 생성 {r.created} · 갱신 {r.updated} · 스킵 {r.skipped}
                  {r.failed > 0 ? (
                    <span className="text-danger-ink"> · 실패 {r.failed}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {committed.createdFestivalIds.length > 0 ? (
            <p className="mt-2 text-label-regular text-muted">
              생성된 축제 {committed.createdFestivalIds.length}건 —{" "}
              <Link
                href={`${ADMIN_ROUTES.festivals}?published=false`}
                className="text-primary underline"
              >
                검수 화면에서 확인
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {preview === null ? (
        <form
          className="flex max-w-[560px] flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleUpload();
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">festivals.csv *</span>
            <input
              type="file"
              accept=".csv"
              required
              onChange={(e) => setFestivalsFile(e.target.files?.[0] ?? null)}
              className={INPUT_CLASS + " py-2"}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">lineups.csv *</span>
            <input
              type="file"
              accept=".csv"
              required
              onChange={(e) => setLineupsFile(e.target.files?.[0] ?? null)}
              className={INPUT_CLASS + " py-2"}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">artists.csv (선택)</span>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setArtistsFile(e.target.files?.[0] ?? null)}
              className={INPUT_CLASS + " py-2"}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">기존 축제와 겹치면</span>
            <select
              value={onConflict}
              onChange={(e) => setOnConflict(e.target.value as OnConflict)}
              className={INPUT_CLASS}
            >
              <option value="UPDATE">덮어쓴다 (UPDATE)</option>
              <option value="SKIP">건너뛴다 (SKIP)</option>
            </select>
          </label>

          {errorMessage === null ? null : (
            <p role="alert" className="text-label-regular text-danger">
              {errorMessage}
            </p>
          )}

          <div>
            <Button type="submit" disabled={upload.isPending}>
              {upload.isPending ? "업로드 중…" : "업로드하고 미리보기"}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreview(null);
                setSelected(new Set());
                setErrorMessage(null);
              }}
            >
              ← 다시 업로드
            </Button>
          </div>
          <PreviewPanel
            preview={preview}
            selected={selected}
            onToggle={handleToggle}
            onCommit={handleCommit}
            isCommitting={commit.isPending}
            errorMessage={errorMessage}
          />
        </>
      )}
    </section>
  );
}
