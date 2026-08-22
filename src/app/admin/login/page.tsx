"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/admin/auth/api";
import { writeToken } from "@/features/admin/auth/token";
import { ADMIN_HOME } from "@/constants/routes";
import { Button } from "@/components/ui/Button";
import {
  ADMIN_ERROR_CODE,
  ADMIN_GENERIC_ERROR_MESSAGE,
  AdminApiError,
  adminErrorMessage,
} from "@/lib/adminError";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { accessToken } = await login(username, password);
      const saved = writeToken(accessToken);
      if (!saved) {
        setError(adminErrorMessage(ADMIN_ERROR_CODE.STORAGE_UNAVAILABLE));
        setPending(false);
        return;
      }
      router.replace(ADMIN_HOME);
    } catch (err) {
      // DEC-0041: message는 개발자용이라 콘솔로만 보낸다.
      console.error("POST /admin/auth/login 실패", err);
      setError(
        err instanceof AdminApiError
          ? adminErrorMessage(err.errorCode)
          : ADMIN_GENERIC_ERROR_MESSAGE,
      );
      setPending(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-admin-shell p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-[380px] max-w-full flex-col gap-4 rounded-card bg-surface p-8"
      >
        <h1 className="text-row-title text-ink">FESTA 관리자</h1>

        <label className="flex flex-col gap-1">
          <span className="text-caption-strong text-muted">아이디</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="h-[48px] rounded-md border border-border bg-surface-field px-4 text-body text-ink"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-caption-strong text-muted">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-[48px] rounded-md border border-border bg-surface-field px-4 text-body text-ink"
          />
        </label>

        {error ? (
          <p role="alert" className="text-caption-strong text-danger-ink">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="disabled:opacity-60">
          {pending ? "로그인 중…" : "로그인"}
        </Button>
      </form>
    </div>
  );
}
