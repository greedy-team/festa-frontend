"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { genreLabel } from "@/lib/artistGenre";
import type { AdminArtist, ArtistMergeCandidates } from "@/features/admin/artist/types";

type Props = {
  /** 목록에서 고른 행. 이 아티스트가 **남는 쪽**(targetId)이다 */
  target: AdminArtist;
  candidates: ArtistMergeCandidates | undefined;
  isLoading?: boolean;
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (body: { targetId: number; sourceIds: number[]; keepAliases: boolean }) => void;
  onClose: () => void;
};

/**
 * 아티스트 병합. **되돌릴 수 없다.**
 *
 * DEC-0046은 문구만이 아니라 「무엇이 무엇으로 바뀌는지」를 보이라고 정했다. 병합
 * 시점에 양쪽 정보를 이미 갖고 있으므로 추가 조회 없이 그릴 수 있다 — 그 결정이
 * 근거로 든 것이 정확히 이 상황이다.
 *
 * 방향을 헷갈리면 지우려던 쪽이 남는다. 그래서 남는 쪽과 사라지는 쪽을 문장으로
 * 못박아 보여준다.
 */
export function ArtistMergeDialog({
  target,
  candidates,
  isLoading = false,
  isPending = false,
  errorMessage = null,
  onSubmit,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sourceIds, setSourceIds] = useState<number[]>([]);
  const [keepAliases, setKeepAliases] = useState(true);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const list = candidates?.candidates ?? [];
  const selected = list.filter((c) => sourceIds.includes(c.artistId));
  // 병합 뒤 남을 별칭 — keepAliases면 사라지는 쪽의 이름과 별칭이 target으로 옮겨간다.
  const resultingAliases = keepAliases
    ? Array.from(
        new Set([
          ...(target.otherNames ?? []),
          ...selected.flatMap((c) => [c.name, ...(c.otherNames ?? [])]),
        ]),
      )
    : (target.otherNames ?? []);

  function toggle(artistId: number) {
    setSourceIds((prev) =>
      prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId],
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
      <h2 className="text-caption-strong text-ink">아티스트 병합</h2>
      <p className="mt-2 text-label-regular text-muted">
        <strong className="text-ink">{target.name}</strong> 이(가) 남고, 아래에서 고른
        아티스트가 여기로 합쳐진 뒤 <strong className="text-ink">삭제됩니다.</strong>{" "}
        되돌릴 수 없습니다.
      </p>

      {isLoading ? (
        <p className="mt-6 text-label-regular text-muted">병합 후보를 불러오는 중…</p>
      ) : list.length === 0 ? (
        <p className="mt-6 text-label-regular text-muted">
          이름이나 별칭이 겹치는 아티스트가 없습니다.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {list.map((candidate) => (
            <li key={candidate.artistId}>
              <label className="flex items-start gap-3 rounded-md border border-border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={sourceIds.includes(candidate.artistId)}
                  onChange={() => toggle(candidate.artistId)}
                />
                <span className="flex flex-col gap-1">
                  <span className="text-caption-strong text-ink">{candidate.name}</span>
                  <span className="text-label-regular text-muted">
                    {genreLabel(candidate.genre)} · 출연 {candidate.appearanceCount}회 · 유사도{" "}
                    {candidate.similarity.toFixed(2)}
                  </span>
                  {(candidate.otherNames ?? []).length === 0 ? null : (
                    <span className="text-label-regular text-muted-soft">
                      별칭: {(candidate.otherNames ?? []).join(", ")}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={keepAliases}
          onChange={(e) => setKeepAliases(e.target.checked)}
        />
        <span className="text-label-regular text-muted">
          사라지는 아티스트의 이름·별칭을 별칭으로 남긴다
        </span>
      </label>

      {selected.length === 0 ? null : (
        <div className="mt-4 rounded-md border border-border bg-surface-field p-3">
          <p className="text-label-regular text-muted">병합 후</p>
          <p className="mt-1 text-caption-strong text-ink">{target.name}</p>
          <p className="mt-1 text-label-regular text-muted">
            별칭 {resultingAliases.length}개
            {resultingAliases.length === 0 ? "" : `: ${resultingAliases.join(", ")}`}
          </p>
          <p className="mt-1 text-label-regular text-muted">
            삭제: {selected.map((c) => c.name).join(", ")}
          </p>
        </div>
      )}

      {errorMessage === null ? null : (
        <p role="alert" className="mt-4 text-label-regular text-danger">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
          닫기
        </Button>
        <Button
          type="button"
          disabled={isPending || selected.length === 0}
          // 화면에 보이는 후보에서 파생한다 — 후보 재조회로 목록이 줄면 sourceIds state에
          // 유령 id가 남을 수 있고, 되돌릴 수 없는 병합에 그 id가 실리면 안 된다.
          onClick={() =>
            onSubmit({
              targetId: target.artistId,
              sourceIds: selected.map((c) => c.artistId),
              keepAliases,
            })
          }
        >
          {isPending ? "병합 중…" : `${selected.length}건 병합`}
        </Button>
      </div>
    </dialog>
  );
}
