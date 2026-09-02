"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HostFormDialog } from "@/features/admin/host/components/HostFormDialog";
import {
  useAdminHost,
  useAdminHosts,
  useCreateHost,
  useDeleteHost,
  useUpdateHost,
} from "@/features/admin/host/queries";
import type { AdminHost, HostFormValues } from "@/features/admin/host/types";
import { safeHttpUrl } from "@/lib/safeUrl";
import { parsePage } from "@/lib/searchParams";
import { ADMIN_ROUTES } from "@/constants/routes";
import {
  ADMIN_GENERIC_ERROR_MESSAGE,
  AdminApiError,
  adminErrorMessage,
} from "@/lib/adminError";

const PAGE_SIZE = 10;

/** 열려 있는 창. 한 번에 하나만 뜬다 */
type Modal =
  | { kind: "create" }
  | { kind: "edit"; hostId: number }
  | { kind: "delete"; host: AdminHost }
  | null;

/**
 * 주최 관리.
 *
 * 검색·필터가 없다. `GET /admin/hosts`가 page·size만 받고 등록 역순 고정이라
 * 화면이 만들 수 있는 것이 없다 — DEC-0143에 따라 「불편할 것 같다」로 앞질러
 * 만들지 않고, 실제로 못 쓸 정도가 되면 그때 백엔드에 파라미터를 요청한다.
 */
export function HostAdminScreen() {
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const [modal, setModal] = useState<Modal>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const list = useAdminHosts({ page: page - 1, size: PAGE_SIZE });
  // 수정 폼은 목록 행이 아니라 단건 조회로 채운다 (DEC-0140).
  const detail = useAdminHost(modal?.kind === "edit" ? modal.hostId : null);

  const create = useCreateHost();
  const update = useUpdateHost();
  const remove = useDeleteHost();

  const items = list.data?.items ?? [];

  function makeHref(next: number) {
    return next > 1 ? `${ADMIN_ROUTES.hosts}?page=${next}` : ADMIN_ROUTES.hosts;
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

  function handleSubmit(values: HostFormValues) {
    setErrorMessage(null);
    if (modal?.kind === "create") {
      create.mutate(values, {
        onSuccess: closeModal,
        onError: (error) => reportError("주최 등록", error),
      });
      return;
    }
    if (modal?.kind === "edit") {
      update.mutate(
        { hostId: modal.hostId, values },
        { onSuccess: closeModal, onError: (error) => reportError("주최 수정", error) },
      );
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-md text-ink">주최</h1>
        <Button type="button" onClick={() => setModal({ kind: "create" })}>
          주최 등록
        </Button>
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
        <p className="text-label-regular text-muted">등록된 주최가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-divider text-left text-label-regular text-muted-soft">
                <th className="p-4">이름</th>
                <th className="hidden p-4 md:table-cell">짧은 이름</th>
                <th className="hidden p-4 md:table-cell">지역</th>
                <th className="hidden p-4 md:table-cell">축제</th>
                <th className="hidden p-4 md:table-cell">공식 사이트</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {items.map((host) => {
                const homepage = host.homepageUrl ? safeHttpUrl(host.homepageUrl) : null;
                return (
                  <tr key={host.hostId} className="border-b border-divider last:border-0">
                    <td className="p-4">
                      <p className="text-caption-strong text-ink">{host.name}</p>
                      <p className="text-label-regular text-muted md:hidden">
                        {host.region || "지역 미입력"} · 축제 {host.festivalCount}개
                      </p>
                    </td>
                    <td className="hidden p-4 text-label-regular text-muted md:table-cell">
                      {host.shortName || "—"}
                    </td>
                    <td className="hidden p-4 text-label-regular text-muted md:table-cell">{host.region || "—"}</td>
                    <td className="hidden p-4 text-label-regular text-muted md:table-cell">
                      {host.festivalCount}개
                    </td>
                    <td className="hidden p-4 text-label-regular text-muted md:table-cell">
                      {homepage ? (
                        <a
                          href={homepage}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline"
                        >
                          링크
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setModal({ kind: "edit", hostId: host.hostId })}
                        >
                          수정
                        </Button>
                        <Button
                          type="button"
                          variant="reset"
                          size="sm"
                          onClick={() => setModal({ kind: "delete", host })}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {list.data === undefined ? null : (
        <Pagination
          page={page}
          totalPages={list.data.totalPages}
          totalElements={list.data.totalElements}
          makeHref={makeHref}
        />
      )}

      {modal?.kind === "create" || modal?.kind === "edit" ? (
        <HostFormDialog
          host={modal.kind === "edit" ? (detail.data ?? null) : null}
          isLoading={modal.kind === "edit" && detail.isLoading}
          isError={modal.kind === "edit" && detail.isError}
          isPending={create.isPending || update.isPending}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      ) : null}

      {modal?.kind === "delete" ? (
        <ConfirmDialog
          title="주최 삭제"
          confirmLabel="삭제"
          isPending={remove.isPending}
          onCancel={closeModal}
          onConfirm={() => {
            setErrorMessage(null);
            remove.mutate(modal.host.hostId, {
              onSuccess: closeModal,
              onError: (error) => reportError("주최 삭제", error),
            });
          }}
        >
          {/* DEC-0046: 무엇이 사라지는지 보여준다. 축제가 있으면 서버가 409로 막는다 */}
          <p>
            <strong className="text-ink">{modal.host.name}</strong> 을(를) 삭제합니다.
            되돌릴 수 없습니다.
          </p>
          <p className="mt-2">
            등록된 축제 {modal.host.festivalCount}개
            {modal.host.festivalCount > 0
              ? " — 축제가 있는 주최는 삭제되지 않습니다."
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
