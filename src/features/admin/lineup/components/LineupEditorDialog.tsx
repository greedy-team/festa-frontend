"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminArtists } from "@/features/admin/artist/queries";
import {
  useAdminLineups,
  useCreateLineup,
  useDeleteLineup,
  useUpdateLineup,
} from "@/features/admin/lineup/queries";
import type { AdminLineup, LineupFormValues } from "@/features/admin/lineup/types";
import type { AdminFestival } from "@/features/admin/festival/types";
import {
  ADMIN_GENERIC_ERROR_MESSAGE,
  AdminApiError,
  adminErrorMessage,
} from "@/lib/adminError";

type Props = {
  festival: AdminFestival;
  onClose: () => void;
};

const EMPTY: LineupFormValues = { artistId: "", day: "1", displayOrder: "1" };

const INPUT_CLASS =
  "h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink";

/**
 * 라인업 편집 — 목록·행 추가·수정·삭제.
 *
 * 목록은 backend#122가 신설한 GET .../lineups로 채운다 — 발행 여부와 관계없이
 * 전체가 day·displayOrder 오름차순으로 내려온다. 임포트로 들어온 기존 행의 교정
 * (ISS-0074 서울대 케이스 — 12행 중 10행의 day 채우기)이 여기서 처음 성립한다.
 */
export function LineupEditorDialog({ festival, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<LineupFormValues>(EMPTY);
  /** null이면 추가 모드, 값이 있으면 그 행을 수정하는 모드 */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [artistQuery, setArtistQuery] = useState("");
  const [artistName, setArtistName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 아티스트는 이름으로 찾아 id로 보낸다 (DEC-0141: 연관은 id로).
  const artistSearch = useAdminArtists({ q: artistQuery, page: 0, size: 10 });
  const searchItems = artistQuery === "" ? [] : (artistSearch.data?.items ?? []);

  // 정렬(day → displayOrder)은 서버 계약이다 — 프론트가 다시 정렬하지 않는다.
  const list = useAdminLineups(festival.festivalId);
  const rows = list.data ?? [];

  const create = useCreateLineup();
  const update = useUpdateLineup();
  const remove = useDeleteLineup();
  const isPending = create.isPending || update.isPending;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function reportError(action: string, error: unknown) {
    // DEC-0041: message는 개발자용이라 콘솔로만 보낸다.
    console.error(`${action} 실패`, error);
    setErrorMessage(
      error instanceof AdminApiError
        ? adminErrorMessage(error.errorCode)
        : ADMIN_GENERIC_ERROR_MESSAGE,
    );
  }

  function resetForm() {
    setValues(EMPTY);
    setEditingId(null);
    setArtistQuery("");
    setArtistName(null);
    setErrorMessage(null);
  }

  function handleSubmit() {
    setErrorMessage(null);
    if (editingId === null) {
      create.mutate(
        { festivalId: festival.festivalId, values },
        { onSuccess: resetForm, onError: (error) => reportError("라인업 추가", error) },
      );
      return;
    }
    update.mutate(
      { festivalId: festival.festivalId, lineupId: editingId, values },
      { onSuccess: resetForm, onError: (error) => reportError("라인업 수정", error) },
    );
  }

  function startEdit(row: AdminLineup) {
    setEditingId(row.lineupId);
    setValues({
      artistId: row.artistId === null ? "" : String(row.artistId),
      day: String(row.day),
      displayOrder: String(row.displayOrder),
    });
    setArtistName(row.artistName);
    setArtistQuery("");
    setErrorMessage(null);
  }

  function handleDelete(row: AdminLineup) {
    setErrorMessage(null);
    remove.mutate(
      { festivalId: festival.festivalId, lineupId: row.lineupId },
      {
        onSuccess: () => {
          if (editingId === row.lineupId) resetForm();
        },
        onError: (error) => reportError("라인업 삭제", error),
      },
    );
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(640px,calc(100vw-32px))] rounded-card border border-border bg-surface p-6 backdrop:bg-black/40"
    >
      <h2 className="text-caption-strong text-ink">라인업 편집 — {festival.name}</h2>
      <p className="mt-1 text-label-regular text-muted">
        {festival.startDate} ~ {festival.endDate} · 라인업 {rows.length}팀
      </p>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            {/* 일차 범위는 서버가 판정한다 — LINEUP_DAY_OUT_OF_RANGE(400) */}
            <span className="text-label-regular text-muted">일차 *</span>
            <input
              type="number"
              min={1}
              required
              value={values.day}
              onChange={(e) => setValues((v) => ({ ...v, day: e.target.value }))}
              className={INPUT_CLASS}
            />
          </label>

          <label className="flex flex-col gap-1">
            {/* 「순번」이 아니다 — 공개 화면 번호는 배열 인덱스가 만든다 (DEC-0109) */}
            <span className="text-label-regular text-muted">정렬 순서 *</span>
            <input
              type="number"
              min={1}
              required
              value={values.displayOrder}
              onChange={(e) => setValues((v) => ({ ...v, displayOrder: e.target.value }))}
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-label-regular text-muted">아티스트</span>
          {values.artistId === "" ? (
            <>
              <input
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
                placeholder="이름·별칭으로 검색 — 비워 두면 시크릿 게스트"
                className={INPUT_CLASS}
              />
              {searchItems.length > 0 ? (
                <ul className="flex flex-col rounded-md border border-border">
                  {searchItems.map((artist) => (
                    <li key={artist.artistId}>
                      <button
                        type="button"
                        onClick={() => {
                          setValues((v) => ({ ...v, artistId: String(artist.artistId) }));
                          setArtistName(artist.name);
                          setArtistQuery("");
                        }}
                        className="w-full cursor-pointer p-2 text-left text-caption-regular text-ink hover:bg-surface-field"
                      >
                        {artist.name}
                        {artist.otherNames.length > 0 ? (
                          <span className="text-muted-soft"> ({artist.otherNames.join(", ")})</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-caption-strong text-ink">{artistName}</span>
              <button
                type="button"
                onClick={() => {
                  setValues((v) => ({ ...v, artistId: "" }));
                  setArtistName(null);
                }}
                className="cursor-pointer text-label-regular text-muted underline"
              >
                선택 해제
              </button>
            </div>
          )}
          {/* DEC-0117: 시크릿은 artistId 비움 하나로 표현한다 — 별도 체크박스 없음 */}
          <span className="text-label-regular text-muted-soft">
            비워 두면 시크릿 게스트로 저장됩니다.
          </span>
        </div>

        {errorMessage === null ? null : (
          <p role="alert" className="text-label-regular text-danger">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2">
          {editingId !== null ? (
            <Button type="button" variant="secondary" onClick={resetForm} disabled={isPending}>
              수정 취소
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중…" : editingId !== null ? "행 수정" : "행 추가"}
          </Button>
        </div>
      </form>

      {list.isLoading ? (
        <p className="mt-6 text-label-regular text-muted">라인업을 불러오는 중…</p>
      ) : list.isError ? (
        <p role="alert" className="mt-6 text-label-regular text-danger">
          라인업 목록을 불러오지 못했습니다.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-label-regular text-muted">아직 라인업이 없습니다.</p>
      ) : (
        <table className="mt-6 w-full border-collapse">
          <thead>
            <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
              <th className="p-2">정렬 순서</th>
              <th className="p-2">아티스트</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              // 서버 정렬이 day 오름차순이라, day가 앞 행과 달라지는 지점이 그룹 경계다.
              <Fragment key={row.lineupId}>
                {i === 0 || rows[i - 1].day !== row.day ? (
                  <tr className="border-b border-divider bg-surface-field">
                    <td colSpan={3} className="p-2 text-label-regular text-muted">
                      {row.day}일차
                    </td>
                  </tr>
                ) : null}
                <tr className="border-b border-divider last:border-0">
                  <td className="p-2 text-caption-regular text-ink">{row.displayOrder}</td>
                  <td className="p-2 text-caption-regular text-ink">
                    {row.artistId === null ? (
                      <span className="text-muted-soft">시크릿 게스트</span>
                    ) : (
                      row.artistName
                    )}
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="cursor-pointer text-label-regular text-primary"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        disabled={remove.isPending}
                        onClick={() => handleDelete(row)}
                        className="cursor-pointer text-label-regular text-danger-ink disabled:text-muted-soft"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </div>
    </dialog>
  );
}
