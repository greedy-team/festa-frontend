"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="mt-16 mb-16 flex flex-col items-center gap-4 py-20">
      <h1 className="text-section-title text-ink">문제가 발생했습니다</h1>
      <p className="text-body text-muted">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="flex h-[44px] cursor-pointer items-center justify-center rounded-md border border-border px-6 text-button-sm text-ink"
      >
        다시 시도
      </button>
    </Container>
  );
}
