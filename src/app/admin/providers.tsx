"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ADMIN_ERROR_CODE, AdminApiError } from "@/lib/adminError";
import { clearToken } from "@/features/admin/auth/token";
import { ADMIN_ROUTES } from "@/constants/routes";

/**
 * TOKEN_EXPIRED·UNAUTHORIZED는 재로그인이 필요하다는 뜻이다 (DEC-0086). 토큰을
 * 지우고 로그인으로 보낸다.
 *
 * 로그인 요청(`features/admin/auth/api.ts`의 `login()`)은 TanStack Query 훅을
 * 쓰지 않으므로 여기 안 걸린다 — 로그인 실패의 401이 로그인 화면으로 자기 자신을
 * 리다이렉트하는 문제가 생기지 않는다.
 *
 * `useRouter` 대신 `window.location.replace`를 쓴다. `QueryClient`는 `useState`
 * 초기화 함수 안에서 한 번만 만들어져 router를 클로저로 잡으면 낡을 수 있고,
 * 세션 만료 시점에는 전체 리로드로 캐시를 비우는 편이 오히려 맞다.
 */
function handleAuthError(error: unknown) {
  if (
    error instanceof AdminApiError &&
    (error.errorCode === ADMIN_ERROR_CODE.TOKEN_EXPIRED ||
      error.errorCode === ADMIN_ERROR_CODE.UNAUTHORIZED)
  ) {
    clearToken();
    window.location.replace(ADMIN_ROUTES.login);
  }
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  // useState로 감싸야 렌더마다 새 클라이언트가 생기지 않는다.
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleAuthError }),
        mutationCache: new MutationCache({ onError: handleAuthError }),
        defaultOptions: {
          queries: {
            // 관리자 화면은 운영자가 방금 바꾼 값을 봐야 한다.
            staleTime: 0,
            retry: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
