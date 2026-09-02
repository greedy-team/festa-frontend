"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  /** 무엇이 무엇으로 바뀌는지 (DEC-0046). 문구만으로는 부족하다 */
  children: ReactNode;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * 되돌릴 수 없는 관리자 작업의 확인 창 (DEC-0046).
 *
 * 관리자 화면은 편의 기능을 만들지 않지만(DEC-0143) 이 확인 단계는 편의가 아니라
 * 안전이라 예외다 — 그 결정이 명시적으로 갈라 두었다.
 *
 * 네이티브 `<dialog>` + `showModal()`을 쓴다 — Esc·포커스 트랩·포커스 복귀·백드롭이
 * 전부 브라우저 몫이 된다 (LineupSheet와 같은 결).
 */
export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        // Esc는 기본 동작으로 닫히지만 부모 상태는 그대로 남는다 — 직접 알린다.
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-card border border-border bg-surface p-6 backdrop:bg-black/40"
    >
      <h2 className="text-caption-strong text-ink">{title}</h2>
      <div className="mt-4 text-label-regular text-muted">{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          닫기
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isPending}>
          {isPending ? "처리 중…" : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
