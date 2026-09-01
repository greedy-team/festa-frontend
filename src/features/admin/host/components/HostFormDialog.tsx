"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AdminHost, HostFormValues } from "@/features/admin/host/types";

type Props = {
  /** null이면 등록, 값이 있으면 수정 */
  host: AdminHost | null;
  isLoading?: boolean;
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: HostFormValues) => void;
  onClose: () => void;
};

const EMPTY: HostFormValues = {
  name: "",
  region: "",
  shortName: "",
  logoUrl: "",
  bannerUrl: "",
  homepageUrl: "",
  instagramUrl: "",
};

function toValues(host: AdminHost | null): HostFormValues {
  if (!host) return EMPTY;
  // null은 폼에서 빈 문자열이다 — 그대로 되보내면 서버가 「삭제」로 읽는다(변화 없음).
  return {
    name: host.name,
    region: host.region ?? "",
    shortName: host.shortName ?? "",
    logoUrl: host.logoUrl ?? "",
    bannerUrl: host.bannerUrl ?? "",
    homepageUrl: host.homepageUrl ?? "",
    instagramUrl: host.instagramUrl ?? "",
  };
}

/** 선택 필드는 전부 String이라 표로 두고 같은 방식으로 그린다 */
const OPTIONAL_FIELDS: { key: keyof HostFormValues; label: string; type?: string }[] = [
  { key: "shortName", label: "짧은 이름" },
  { key: "logoUrl", label: "로고 URL", type: "url" },
  { key: "bannerUrl", label: "배너 URL", type: "url" },
  { key: "homepageUrl", label: "공식 사이트 URL", type: "url" },
  { key: "instagramUrl", label: "인스타그램 URL", type: "url" },
];

/**
 * 주최 등록·수정 폼.
 *
 * Swagger가 「전체 교체다 — name·region은 필수, 나머지 다섯은 공백을 삭제로 읽는다」로
 * 못박은 계약을 그대로 따른다. 빈 `<input>`이 내는 `""`가 곧 삭제라 별도 매핑이 없다.
 *
 * 단건 조회(DEC-0140)는 창이 열린 뒤 도착하므로, 이펙트로 밀어넣지 않고 「아직 손대지
 * 않았으면 서버 값을 따르는」 파생으로 둔다 — 응답이 늦게 와서 입력을 덮어쓰지 않는다.
 */
export function HostFormDialog({
  host,
  isLoading = false,
  isPending = false,
  errorMessage = null,
  onSubmit,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<HostFormValues | null>(null);

  const values = draft ?? toValues(host);

  function patch(next: Partial<HostFormValues>) {
    setDraft({ ...values, ...next });
  }

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

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
        {host === null ? "주최 등록" : "주최 수정"}
      </h2>

      {isLoading ? (
        <p className="mt-6 text-label-regular text-muted">불러오는 중…</p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(values);
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
            {/* region도 필수다 — 비우면 HOST_INVALID_REGION(400)이다 */}
            <span className="text-label-regular text-muted">지역 *</span>
            <input
              required
              value={values.region}
              onChange={(e) => patch({ region: e.target.value })}
              className="h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink"
            />
          </label>

          {OPTIONAL_FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-1">
              <span className="text-label-regular text-muted">{field.label}</span>
              <input
                type={field.type ?? "text"}
                value={values[field.key]}
                onChange={(e) => patch({ [field.key]: e.target.value })}
                className="h-[44px] rounded-md border border-border bg-surface px-3 text-caption-regular text-ink"
              />
            </label>
          ))}

          <p className="text-label-regular text-muted-soft">
            비워 두면 그 값은 삭제됩니다 — 저장은 전체 교체입니다.
          </p>

          {errorMessage === null ? null : (
            <p role="alert" className="text-label-regular text-danger">
              {errorMessage}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              취소
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
