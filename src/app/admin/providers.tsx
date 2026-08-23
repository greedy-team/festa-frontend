"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  // useState로 감싸야 렌더마다 새 클라이언트가 생기지 않는다.
  const [client] = useState(
    () =>
      new QueryClient({
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
