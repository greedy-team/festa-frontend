'use client';

import { useEffect, useState } from 'react';

/**
 * app/layout.tsx에서 감싸서 쓴다:
 *
 *   {MOCKING_ENABLED
 *     ? <MockProvider>{children}</MockProvider>
 *     : children}
 *
 * 워커가 준비되기 전까지 자식을 렌더링하지 않아서, 초기 렌더에 실제 네트워크로
 * 요청이 새는 걸 막는다(특히 클라이언트에서 fetch하는 검색 자동완성 같은 컴포넌트).
 */
export function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { worker } = await import('@/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      setReady(true);
    }
    init().catch((e) => {
      console.error('[MSW] worker.start() 실패 — 모킹 없이 계속 진행합니다', e);
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
