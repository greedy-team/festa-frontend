"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminHosts } from "@/features/admin/host/queries";
import {
  EMPTY_FESTIVAL_FORM,
  coordinateError,
  toFestivalFormValues,
} from "@/features/admin/festival/festivalForm";
import type {
  AdminFestivalDetail,
  ExternalVisitorPolicy,
  FestivalFormValues,
  TicketType,
  VerificationMethod,
} from "@/features/admin/festival/types";
import {
  EXTERNAL_VISITOR_LABELS,
  TICKET_TYPE_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/adminEnums";

type Props = {
  /** null이면 등록, 값이 있으면 수정 */
  festival: AdminFestivalDetail | null;
  isLoading?: boolean;
  /** 단건 조회 실패 — 폼을 내지 않는다 */
  isError?: boolean;
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: FestivalFormValues) => void;
  onClose: () => void;
};

const INPUT_CLASS =
  "h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink";

/**
 * 축제 등록·수정 폼.
 *
 * Swagger 계약 그대로다 — 「전체 교체다. name·startDate·endDate·hostId는 필수,
 * 나머지는 비워도 저장되고 발행 게이트가 막는다」. 빈 값의 타입별 직렬화는
 * festivalForm.ts의 toFestivalRequestBody가 전담한다.
 *
 * 단건 조회(DEC-0140)는 창이 열린 뒤 도착하므로, 이펙트로 밀어넣지 않고 「아직
 * 손대지 않았으면 서버 값을 따르는」 파생으로 둔다 (아티스트·주최 폼과 같은 결).
 */
export function FestivalFormDialog({
  festival,
  isLoading = false,
  isError = false,
  isPending = false,
  errorMessage = null,
  onSubmit,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<FestivalFormValues | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // ponytail: size 50(서버 상한)의 첫 페이지만 — 주최가 50을 넘으면 페이지 순회가 필요하다
  const hosts = useAdminHosts({ page: 0, size: 50 });
  // 현재 주최가 첫 페이지에 없으면 select가 빈 값으로 보여 운영자가 엉뚱한 주최로
  // 다시 고를 수 있다 — 단건 조회의 hostId·hostName으로 옵션을 하나 채워 넣는다.
  const hostOptions = (() => {
    const items = hosts.data?.items ?? [];
    if (festival?.hostId != null && !items.some((h) => h.hostId === festival.hostId)) {
      return [{ hostId: festival.hostId, name: festival.hostName ?? `#${festival.hostId}` }, ...items];
    }
    return items;
  })();

  const values = draft ?? (festival ? toFestivalFormValues(festival) : EMPTY_FESTIVAL_FORM);

  function patch(next: Partial<FestivalFormValues>) {
    setDraft({ ...values, ...next });
  }

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // 단건 조회가 아직이면 festival이 null이어도 수정 모드다 — 제목이 「등록」으로 새지 않게.
  const isEdit = festival !== null || isLoading || isError;
  const isPublished = festival?.publishedAt != null;
  const coordError = coordinateError(values.latitude, values.longitude, isPublished);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(720px,calc(100vw-32px))] rounded-card border border-border bg-surface p-6 backdrop:bg-black/40"
    >
      <h2 className="text-caption-strong text-ink">{isEdit ? "축제 수정" : "축제 등록"}</h2>
      {isPublished ? (
        <p className="mt-1 text-label-regular text-muted">
          발행 중인 축제입니다 — 수정은 되지만 좌표는 비울 수 없습니다.
        </p>
      ) : null}

      {isError ? (
        // 단건 조회 실패. 폼을 빈 값으로 그리면 저장이 전체 교체(DEC-0141)라 레코드를
        // 비워버린다 — 폼 자체를 내지 않고 닫기만 남긴다.
        <>
          <p role="alert" className="mt-6 text-label-regular text-danger">
            축제 정보를 불러오지 못했습니다. 닫고 다시 시도해 주세요.
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
            if (coordError) {
              setLocalError(coordError);
              return;
            }
            setLocalError(null);
            onSubmit(values);
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              {/* PATCH에서도 필수다 — 미연결 축제는 수정하려면 주최부터 골라야 한다 */}
              <span className="text-label-regular text-muted">주최 *</span>
              <select
                required
                value={values.hostId}
                onChange={(e) => patch({ hostId: e.target.value })}
                className={INPUT_CLASS}
              >
                <option value="">선택해 주세요</option>
                {hostOptions.map((host) => (
                  <option key={host.hostId} value={String(host.hostId)}>
                    {host.name}
                  </option>
                ))}
              </select>
              {isEdit && festival?.hostId === null ? (
                <span className="text-label-regular text-muted-soft">
                  주최 미연결 축제입니다 — 저장하려면 주최를 골라야 합니다.
                </span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">축제 이름 *</span>
              <input
                required
                value={values.name}
                onChange={(e) => patch({ name: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">시작일 *</span>
              <input
                type="date"
                required
                value={values.startDate}
                onChange={(e) => patch({ startDate: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">종료일 *</span>
              <input
                type="date"
                required
                value={values.endDate}
                onChange={(e) => patch({ endDate: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">
                위도{isPublished ? " *" : ""}
              </span>
              <input
                type="number"
                step="any"
                value={values.latitude}
                onChange={(e) => patch({ latitude: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">
                경도{isPublished ? " *" : ""}
              </span>
              <input
                type="number"
                step="any"
                value={values.longitude}
                onChange={(e) => patch({ longitude: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">외부인 입장</span>
              <select
                value={values.externalVisitor}
                onChange={(e) =>
                  patch({ externalVisitor: e.target.value as ExternalVisitorPolicy | "" })
                }
                className={INPUT_CLASS}
              >
                <option value="">선택 안 함</option>
                {Object.entries(EXTERNAL_VISITOR_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">본인 확인</span>
              <select
                value={values.verification}
                onChange={(e) =>
                  patch({ verification: e.target.value as VerificationMethod | "" })
                }
                className={INPUT_CLASS}
              >
                <option value="">선택 안 함</option>
                {Object.entries(VERIFICATION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">티켓</span>
              <select
                value={values.ticketType}
                onChange={(e) => patch({ ticketType: e.target.value as TicketType | "" })}
                className={INPUT_CLASS}
              >
                <option value="">선택 안 함</option>
                {Object.entries(TICKET_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">티켓 오픈 시각</span>
              <input
                type="datetime-local"
                step={1}
                value={values.ticketOpenAt}
                onChange={(e) => patch({ ticketOpenAt: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">장소 이름</span>
              <input
                value={values.venueName}
                onChange={(e) => patch({ venueName: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">주소</span>
              <input
                value={values.address}
                onChange={(e) => patch({ address: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">포스터 URL</span>
              <input
                type="url"
                value={values.posterUrl}
                onChange={(e) => patch({ posterUrl: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">인스타그램 URL</span>
              <input
                type="url"
                value={values.instagramUrl}
                onChange={(e) => patch({ instagramUrl: e.target.value })}
                className={INPUT_CLASS}
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-label-regular text-muted">임포트 키</span>
              <input
                value={values.importKey}
                onChange={(e) => patch({ importKey: e.target.value })}
                className={INPUT_CLASS}
              />
              {/* DEC-0118: 형식 검증이 없다 — 오타의 결과는 에러가 아니라 중복 축제다 */}
              <span className="text-label-regular text-muted-soft">
                크롤러 임포트와 이 축제를 잇는 키입니다. 틀리게 적으면 다음 임포트가 같은
                축제를 못 찾아 중복이 생깁니다. 모르면 비워 두세요.
              </span>
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-label-regular text-muted">소개</span>
              <textarea
                rows={3}
                value={values.description}
                onChange={(e) => patch({ description: e.target.value })}
                className="rounded-md border border-border bg-surface p-3 text-caption-regular text-ink"
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-label-regular text-muted">입장 안내</span>
              <textarea
                rows={2}
                value={values.admissionNote}
                onChange={(e) => patch({ admissionNote: e.target.value })}
                className="rounded-md border border-border bg-surface p-3 text-caption-regular text-ink"
              />
            </label>
          </div>

          <p className="text-label-regular text-muted-soft">
            비워 둔 선택 항목은 삭제됩니다 — 저장은 전체 교체입니다. 좌표는 크롤러
            재임포트가 덮어쓸 수 있습니다.
          </p>

          {/* 서버 값 자체가 반쪽 좌표일 수 있다(미발행 축제는 서버가 안 막는다) —
              폼을 열자마자 저장이 비활성이면 그 이유를 손대기 전에도 보여야 한다 */}
          {coordError ? (
            <p role="alert" className="text-label-regular text-danger">
              {coordError}
            </p>
          ) : localError ? (
            <p role="alert" className="text-label-regular text-danger">
              {localError}
            </p>
          ) : null}

          {errorMessage === null ? null : (
            <p role="alert" className="text-label-regular text-danger">
              {errorMessage}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              닫기
            </Button>
            <Button type="submit" disabled={isPending || coordError !== null}>
              {isPending ? "저장 중…" : "저장"}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
