"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GENRE_LABELS } from "@/lib/artistGenre";
import type { ArtistGenre } from "@/features/artists/types";
import type { AdminArtist, ArtistFormValues } from "@/features/admin/artist/types";
import { formatOtherNames, parseOtherNames } from "@/features/admin/artist/otherNames";

type Props = {
  /** null이면 등록, 값이 있으면 수정 */
  artist: AdminArtist | null;
  isLoading?: boolean;
  /** 단건 조회 실패 — 폼을 내지 않는다 */
  isError?: boolean;
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: ArtistFormValues) => void;
  onClose: () => void;
};

const EMPTY: ArtistFormValues = {
  name: "",
  otherNames: [],
  genre: "",
  instagramUrl: "",
  needsReview: false,
};

function toValues(artist: AdminArtist | null): ArtistFormValues {
  if (!artist) return EMPTY;
  return {
    name: artist.name,
    otherNames: artist.otherNames ?? [],
    // 서버가 null을 주면 폼에서는 빈 선택이다 — DEC-0150에서 ""가 「비우기」다.
    genre: artist.genre ?? "",
    instagramUrl: artist.instagramUrl ?? "",
    needsReview: artist.needsReview ?? false,
  };
}

/**
 * 아티스트 등록·수정 폼.
 *
 * DEC-0141: 수정 여부와 무관하게 **전체를 되보낸다.** 그래서 dirty 필드를 추적하지
 * 않고 폼 상태를 통째로 넘긴다. 빈 `<input>`·빈 `<select>`가 내는 값이 그대로 `""`라
 * DEC-0150의 「빈 값은 빈 문자열」계약과 그대로 맞아떨어진다 — null 매핑 계층이 없다.
 */
export function ArtistFormDialog({
  artist,
  isLoading = false,
  isError = false,
  isPending = false,
  errorMessage = null,
  onSubmit,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 단건 조회(DEC-0140)는 창이 열린 뒤에 도착한다. 그것을 이펙트로 폼에 밀어넣으면
  // 렌더 → setState → 렌더가 되므로, 대신 **아직 손대지 않았으면 서버 값을 따르는**
  // 파생으로 둔다. 사용자가 한 글자라도 치면 draft가 서고 그때부터 폼이 이긴다 —
  // 응답이 늦게 와서 입력을 덮어쓰는 사고도 같이 막힌다.
  const [draft, setDraft] = useState<ArtistFormValues | null>(null);
  const [otherNamesDraft, setOtherNamesDraft] = useState<string | null>(null);

  const values = draft ?? toValues(artist);
  const otherNamesText = otherNamesDraft ?? formatOtherNames(artist?.otherNames);

  function patch(next: Partial<ArtistFormValues>) {
    setDraft({ ...values, ...next });
  }

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // 단건 조회가 아직이면 artist가 null이어도 수정 모드다 — 제목이 「등록」으로 새지 않게.
  const isEdit = artist !== null || isLoading || isError;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(560px,calc(100vw-32px))] rounded-card border border-border bg-surface p-6 backdrop:bg-black/40"
    >
      <h2 className="text-caption-strong text-ink">
        {isEdit ? "아티스트 수정" : "아티스트 등록"}
      </h2>

      {isError ? (
        // 단건 조회 실패. 폼을 빈 값으로 그리면 저장이 전체 교체(DEC-0141)라 레코드를
        // 비워버린다 — 폼 자체를 내지 않고 닫기만 남긴다.
        <>
          <p role="alert" className="mt-6 text-label-regular text-danger">
            아티스트 정보를 불러오지 못했습니다. 닫고 다시 시도해 주세요.
          </p>
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              닫기
            </Button>
          </div>
        </>
      ) : isLoading ? (
        <p className="mt-6 text-label-regular text-muted">불러오는 중…</p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ ...values, otherNames: parseOtherNames(otherNamesText) });
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">이름 *</span>
            <input
              required
              value={values.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">
              별칭 — 한 줄에 하나. 비우면 전부 삭제된다
            </span>
            <textarea
              rows={3}
              value={otherNamesText}
              onChange={(e) => setOtherNamesDraft(e.target.value)}
              className="rounded-md border border-border bg-surface p-3 text-caption-regular text-ink"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">장르</span>
            <select
              value={values.genre}
              onChange={(e) => patch({ genre: e.target.value as ArtistGenre | "" })}
              className="h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink"
            >
              {/*
                이 ""는 요청에 그대로 나가지 않는다 — api.ts가 null로 바꾼다.
                enum에 ""를 보내면 Jackson이 InvalidFormatException으로 400을 낸다.
              */}
              <option value="">선택 안 함</option>
              {Object.entries(GENRE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {isEdit && artist?.genre ? (
              <span className="text-label-regular text-muted-soft">
                이미 설정된 장르는 지울 수 없습니다 — `Artist.update`가 빈 값을 「변경
                없음」으로 읽습니다. 다른 장르로 바꾸는 것만 됩니다.
              </span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label-regular text-muted">인스타그램 URL</span>
            <input
              type="url"
              value={values.instagramUrl}
              onChange={(e) => patch({ instagramUrl: e.target.value })}
              className="h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={values.needsReview}
              onChange={(e) => patch({ needsReview: e.target.checked })}
            />
            <span className="text-label-regular text-muted">검수 필요로 표시</span>
          </label>

          {errorMessage === null ? null : (
            <p role="alert" className="text-label-regular text-danger">
              {errorMessage}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              닫기
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중…" : "저장"}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
