"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ADMIN_ROUTES } from "@/constants/routes";
import type {
  ImportPreview,
  ImportPreviewRow,
  ImportSection,
} from "@/features/admin/import/types";

type Props = {
  preview: ImportPreview;
  /** `${section}:${line}` 키 */
  selected: Set<string>;
  onToggle: (row: ImportPreviewRow) => void;
  onCommit: () => void;
  isCommitting: boolean;
  errorMessage: string | null;
};

export function rowKey(row: ImportPreviewRow): string {
  return `${row.section}:${row.line}`;
}

const SECTION_LABELS: Record<ImportSection, string> = {
  FESTIVALS: "축제",
  LINEUPS: "라인업",
  ARTISTS: "아티스트",
};

const ACTION_TONE = {
  CREATE: "success",
  UPDATE: "neutral",
  SKIP: "warning",
  INVALID: "danger",
} as const;

/**
 * 행의 대표 이름. values의 키는 CSV 헤더 그대로다(백엔드 ImportSection) —
 * festivals·artists는 `name`, lineups는 `artist_canonical`.
 */
export function rowName(row: ImportPreviewRow): string {
  const v = row.values ?? {};
  return v.name ?? v.artist_canonical ?? row.importKey ?? `${row.line}행`;
}

/**
 * 임포트 미리보기 — 행 선택과 커밋.
 *
 * INVALID 행은 선택할 수 없다(커밋해도 들어가지 않는다 — DEC-0096). 대신 importKey가
 * 있으면 축제 검수 화면 검색으로 잇는다 — 미리보기에서 INVALID를 본 운영자가 곧바로
 * 교정 화면으로 가는 동선이 이것이다 (#122의 존재 이유).
 */
export function PreviewPanel({
  preview,
  selected,
  onToggle,
  onCommit,
  isCommitting,
  errorMessage,
}: Props) {
  const { summary } = preview;
  // 라인업 행에는 축제 이름이 없다 — 같은 미리보기의 축제 섹션에서 잇는다.
  // 검수 화면의 q는 축제 이름만 검색하므로(import_key는 검색 대상이 아니다)
  // 링크는 이름으로 만들어야 커밋 후에 실제로 찾아진다.
  const nameByImportKey = new Map(
    preview.rows
      .filter((row) => row.section === "FESTIVALS" && row.importKey && row.values?.name)
      .map((row) => [row.importKey as string, row.values.name as string]),
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge>{`전체 ${summary.total}`}</StatusBadge>
        <StatusBadge tone="success">{`생성 ${summary.toCreate}`}</StatusBadge>
        <StatusBadge>{`갱신 ${summary.toUpdate}`}</StatusBadge>
        <StatusBadge tone="warning">{`스킵 ${summary.toSkip}`}</StatusBadge>
        <StatusBadge tone="danger">{`INVALID ${summary.invalid}`}</StatusBadge>
        {/* 만료 판정은 서버가 한다(IMPORT_EXPIRED 409) — 여기선 시한만 보여준다.
            렌더 중 Date.now() 비교는 불순해서 안 하고, 지나서 커밋하면 에러 문구가 안내한다 */}
        <span className="ml-auto text-label-regular text-muted">
          만료: {new Date(preview.expiresAt).toLocaleTimeString("ko-KR")} (업로드 후 30분)
        </span>
      </div>

      {preview.blockers.length > 0 ? (
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-label-regular text-muted-soft">차단 사유 집계</p>
          <ul className="mt-1 flex flex-col gap-1">
            {preview.blockers.map((blocker) => (
              <li key={blocker.code} className="text-label-regular text-danger-ink">
                {blocker.code} × {blocker.count}
                {blocker.values.length > 0 ? (
                  <span className="text-muted-soft"> — {blocker.values.join(", ")}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.invalid > 0 ? (
        <p className="text-label-regular text-muted-soft">
          INVALID 행은 커밋에 포함되지 않습니다. 축제 행이 INVALID면 「축제 등록」에서
          임포트 키를 채워 직접 만들고, 라인업 행만 INVALID면 커밋 뒤 그 축제의 라인업
          편집에서 채웁니다.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-card border border-border bg-surface">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
              <th className="p-3" />
              <th className="hidden p-3 md:table-cell">행</th>
              <th className="p-3">대상</th>
              <th className="p-3">동작</th>
              <th className="hidden p-3 md:table-cell">문제</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row, i) => {
              const selectable = row.action === "CREATE" || row.action === "UPDATE";
              const problems = [...row.errors, ...row.warnings];
              return (
                <Fragment key={rowKey(row)}>
                  {i === 0 || preview.rows[i - 1].section !== row.section ? (
                    <tr className="border-b border-divider bg-surface-field">
                      <td colSpan={6} className="p-2 text-label-regular text-muted">
                        {SECTION_LABELS[row.section]}
                      </td>
                    </tr>
                  ) : null}
                  <tr className="border-b border-divider last:border-0">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        aria-label={`${rowName(row)} 선택`}
                        disabled={!selectable}
                        checked={selected.has(rowKey(row))}
                        onChange={() => onToggle(row)}
                      />
                    </td>
                    <td className="hidden p-3 text-label-regular text-muted md:table-cell">
                      {row.line}
                    </td>
                    <td className="p-3">
                      <p className="text-caption-regular text-ink">{rowName(row)}</p>
                      {/* 모바일에선 문제 열이 접히므로 코드만 여기로 — INVALID 분류가
                          모바일에서도 가능해야 「검수에서 찾기」 동선이 산다 */}
                      {problems.length > 0 ? (
                        <p className="text-label-regular text-danger-ink md:hidden">
                          {problems.map((problem) => problem.code).join(" · ")}
                        </p>
                      ) : null}
                    </td>
                    <td className="p-3">
                      <StatusBadge tone={ACTION_TONE[row.action]}>{row.action}</StatusBadge>
                      {row.skipReason ? (
                        <span className="ml-2 text-label-regular text-muted-soft">
                          {row.skipReason}
                        </span>
                      ) : null}
                    </td>
                    <td className="hidden p-3 md:table-cell">
                      {problems.length === 0 ? (
                        <span className="text-label-regular text-muted-soft">—</span>
                      ) : (
                        <ul className="flex flex-col gap-0.5">
                          {problems.map((problem, j) => (
                            <li
                              key={j}
                              className={`text-label-regular ${problem.blocker ? "text-danger-ink" : "text-muted"}`}
                            >
                              {problem.code}
                              <span className="text-muted-soft"> {problem.message}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {/* 새 탭 — 미리보기는 업로드 응답을 든 컴포넌트 상태가 전부라
                          (재조회 API 없음) 같은 탭으로 가면 돌아올 수 없다. */}
                      {row.action !== "INVALID" ? null : row.section === "LINEUPS" &&
                        row.importKey &&
                        nameByImportKey.has(row.importKey) ? (
                        // 축제는 커밋되고 이 행만 빠진다 — 커밋 후 이름으로 찾아 라인업을 채운다.
                        <Link
                          href={`${ADMIN_ROUTES.festivals}?q=${encodeURIComponent(nameByImportKey.get(row.importKey) as string)}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-label-regular text-primary underline"
                        >
                          커밋 후 검수에서 찾기 ↗
                        </Link>
                      ) : row.section === "ARTISTS" ? (
                        // 아티스트 행이 INVALID — 아티스트 화면에서 직접 등록한다.
                        <Link
                          href={ADMIN_ROUTES.artists}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-label-regular text-primary underline"
                        >
                          아티스트에서 등록 ↗
                        </Link>
                      ) : (
                        // 축제 행 자체가 INVALID다 — 커밋에 안 들어가므로 찾을 것이 없고,
                        // 등록 폼에서 임포트 키를 채워 직접 만드는 것이 맞는 동선이다 (DEC-0118).
                        <Link
                          href={ADMIN_ROUTES.festivals}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-label-regular text-primary underline"
                        >
                          등록으로 만들기 ↗
                        </Link>
                      )}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {errorMessage === null ? null : (
        <p role="alert" className="text-label-regular text-danger">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={isCommitting || selected.size === 0}
          onClick={onCommit}
        >
          {isCommitting ? "커밋 중…" : `${selected.size}행 커밋`}
        </Button>
      </div>
    </section>
  );
}
