"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/routes";
import { readToken } from "@/features/admin/auth/token";

/**
 * localStorage는 useEffect에서만 읽히므로, 확인 전에는 아무것도 그리지 않는다.
 * 그냥 두면 콘솔 마크업이 한 프레임 번쩍인 뒤 리다이렉트된다.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (readToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 의도적: 확인 전엔 아무것도 그리지 않는다 (마크업 번쩍임 방지)
      setAllowed(true);
      return;
    }
    router.replace(ADMIN_ROUTES.login);
  }, [router]);

  return allowed ? <>{children}</> : null;
}
