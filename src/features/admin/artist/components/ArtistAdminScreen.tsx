"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArtistFormDialog } from "@/features/admin/artist/components/ArtistFormDialog";
import { ArtistMergeDialog } from "@/features/admin/artist/components/ArtistMergeDialog";
import {
  useAdminArtist,
  useAdminArtists,
  useCreateArtist,
  useDeleteArtist,
  useMergeArtists,
  useMergeCandidates,
  useUpdateArtist,
} from "@/features/admin/artist/queries";
import {
  ARTIST_SORT,
  type AdminArtist,
  type ArtistFormValues,
  type ArtistSort,
} from "@/features/admin/artist/types";
import type { ArtistGenre } from "@/features/artists/types";
import { GENRE_LABELS, genreLabel } from "@/lib/artistGenre";
import { parsePage } from "@/lib/searchParams";
import { ADMIN_ROUTES } from "@/constants/routes";
import {
  ADMIN_GENERIC_ERROR_MESSAGE,
  AdminApiError,
  adminErrorMessage,
} from "@/lib/adminError";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: ArtistSort; label: string }[] = [
  { value: ARTIST_SORT.CREATED_DESC, label: "최근 등록순" },
  { value: ARTIST_SORT.APPEARANCES, label: "출연 많은 순" },
  { value: ARTIST_SORT.NAME, label: "이름순" },
];

const VALID_GENRES = Object.keys(GENRE_LABELS) as ArtistGenre[];

function parseGenre(raw: string | null): ArtistGenre | undefined {
  return VALID_GENRES.find((g) => g === raw);
}

function parseSort(raw: string | null): ArtistSort {
  return SORT_OPTIONS.find((o) => o.value === raw)?.value ?? ARTIST_SORT.CREATED_DESC;
}

/** 열려 있는 창. 한 번에 하나만 뜬다 — 상태를 여러 슬롯으로 나누면 순서 문제가 생긴다 */
type Modal =
  | { kind: "create" }
  | { kind: "edit"; artistId: number }
  | { kind: "delete"; artist: AdminArtist }
  | { kind: "merge"; artist: AdminArtist }
  | null;

export function ArtistAdminScreen() {
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const genre = parseGenre(searchParams.get("genre"));
  const sort = parseSort(searchParams.get("sort"));
  const q = searchParams.get("q") ?? undefined;
  const needsReview = searchParams.get("needsReview") === "true" ? true : undefined;

  const [modal, setModal] = useState<Modal>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const list = useAdminArtists({ needsReview, q, genre, sort, page: page - 1, size: PAGE_SIZE });
  // 수정 폼은 목록 행이 아니라 단건 조회로 채운다 (DEC-0140).
  const detail = useAdminArtist(modal?.kind === "edit" ? modal.artistId : null);
  const candidates = useMergeCandidates(modal?.kind === "merge" ? modal.artist.artistId : null);

  const create = useCreateArtist();
  const update = useUpdateArtist();
  const remove = useDeleteArtist();
  const merge = useMergeArtists();

  const items = list.data?.items ?? [];

  function makeHref(next: { page?: number; needsReview?: boolean }) {
    const p = new URLSearchParams();
    const nextNeedsReview = "needsReview" in next ? next.needsReview : needsReview;
    if (nextNeedsReview) p.set("needsReview", "true");
    if (genre) p.set("genre", genre);
    if (q) p.set("q", q);
    if (sort !== ARTIST_SORT.CREATED_DESC) p.set("sort", sort);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    return qs ? `${ADMIN_ROUTES.artists}?${qs}` : ADMIN_ROUTES.artists;
  }

  function reportError(action: string, error: unknown) {
    // DEC-0041: message는 개발자용이라 콘솔로만 보낸다.
    console.error(`${action} 실패`, error);
    setErrorMessage(
      error instanceof AdminApiError
        ? adminErrorMessage(error.errorCode)
        : ADMIN_GENERIC_ERROR_MESSAGE,
    );
  }

  function closeModal() {
    setModal(null);
    setErrorMessage(null);
  }

  function handleSubmit(values: ArtistFormValues) {
    setErrorMessage(null);
    if (modal?.kind === "create") {
      create.mutate(values, {
        onSuccess: closeModal,
        onError: (error) => reportError("아티스트 등록", error),
      });
      return;
    }
    if (modal?.kind === "edit") {
      update.mutate(
        { artistId: modal.artistId, values },
        { onSuccess: closeModal, onError: (error) => reportError("아티스트 수정", error) },
      );
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-md text-ink">아티스트</h1>
        <Button type="button" onClick={() => setModal({ kind: "create" })}>
          아티스트 등록
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip href={makeHref({ needsReview: undefined, page: 1 })} active={!needsReview}>
          전체
        </FilterChip>
        <FilterChip href={makeHref({ needsReview: true, page: 1 })} active={needsReview === true}>
          검수 필요
        </FilterChip>
        <SearchInput name="q" placeholder="이름·별칭 검색" className="ml-auto" />
        <SortDropdown name="sort" value={sort} options={SORT_OPTIONS} ariaLabel="정렬" />
      </div>

      {errorMessage === null || modal !== null ? null : (
        <p role="alert" className="text-label-regular text-danger">
          {errorMessage}
        </p>
      )}

      {list.isLoading ? (
        <p className="text-label-regular text-muted">불러오는 중…</p>
      ) : list.isError ? (
        <p role="alert" className="text-label-regular text-danger">
          목록을 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p className="text-label-regular text-muted">조건에 맞는 아티스트가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
                <th className="p-4">이름</th>
                <th className="p-4">별칭</th>
                <th className="p-4">장르</th>
                <th className="p-4">출연</th>
                <th className="p-4">검수</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {items.map((artist) => (
                <tr key={artist.artistId} className="border-b border-divider last:border-0">
                  <td className="p-4 text-caption-strong text-ink">{artist.name}</td>
                  <td className="p-4 text-label-regular text-muted">
                    {(artist.otherNames ?? []).join(", ") || "—"}
                  </td>
                  <td className="p-4 text-label-regular text-muted">
                    {genreLabel(artist.genre)}
                  </td>
                  <td className="p-4 text-label-regular text-muted">
                    {artist.appearanceCount}회
                  </td>
                  <td className="p-4 text-label-regular text-muted">
                    {artist.needsReview ? "필요" : "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setModal({ kind: "edit", artistId: artist.artistId })}
                      >
                        수정
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setModal({ kind: "merge", artist })}
                      >
                        병합
                      </Button>
                      <Button
                        type="button"
                        variant="reset"
                        size="sm"
                        onClick={() => setModal({ kind: "delete", artist })}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.data === undefined ? null : (
        <Pagination
          page={page}
          totalPages={list.data.totalPages}
          totalElements={list.data.totalElements}
          makeHref={(next) => makeHref({ page: next })}
        />
      )}

      {modal?.kind === "create" || modal?.kind === "edit" ? (
        <ArtistFormDialog
          artist={modal.kind === "edit" ? (detail.data ?? null) : null}
          isLoading={modal.kind === "edit" && detail.isLoading}
          isPending={create.isPending || update.isPending}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      ) : null}

      {modal?.kind === "merge" ? (
        <ArtistMergeDialog
          target={modal.artist}
          candidates={candidates.data}
          isLoading={candidates.isLoading}
          isPending={merge.isPending}
          errorMessage={errorMessage}
          onSubmit={(body) => {
            setErrorMessage(null);
            merge.mutate(body, {
              onSuccess: closeModal,
              onError: (error) => reportError("아티스트 병합", error),
            });
          }}
          onClose={closeModal}
        />
      ) : null}

      {modal?.kind === "delete" ? (
        <ConfirmDialog
          title="아티스트 삭제"
          confirmLabel="삭제"
          isPending={remove.isPending}
          onCancel={closeModal}
          onConfirm={() => {
            setErrorMessage(null);
            remove.mutate(modal.artist.artistId, {
              onSuccess: closeModal,
              onError: (error) => reportError("아티스트 삭제", error),
            });
          }}
        >
          {/* DEC-0046: 무엇이 사라지는지 보여준다. 출연 이력이 있으면 서버가 409로 막는다 */}
          <p>
            <strong className="text-ink">{modal.artist.name}</strong> 을(를) 삭제합니다.
            되돌릴 수 없습니다.
          </p>
          <p className="mt-2">
            출연 이력 {modal.artist.appearanceCount}회
            {modal.artist.appearanceCount > 0
              ? " — 이력이 있는 아티스트는 삭제되지 않습니다."
              : ""}
          </p>
          {errorMessage === null ? null : (
            <p role="alert" className="mt-2 text-danger">
              {errorMessage}
            </p>
          )}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}
