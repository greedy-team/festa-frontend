"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <h1 className="text-row-title text-ink">문제가 발생했습니다</h1>
      <p className="text-body text-muted">잠시 후 다시 시도해주세요.</p>
      <Button type="button" variant="secondary-ink" size="sm" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  );
}
