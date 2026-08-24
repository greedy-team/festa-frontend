import { MOCKING_ENABLED } from '@/lib/mocking';

// Next.js가 서버 시작 시 자동으로 호출하는 훅.
// async Server Component의 fetch()는 여기서 켜진 MSW server가 가로챈다.
// (테스트 전략 문서 근거: async Server Component 데이터 페칭은 Node 런타임에서 실행됨)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && MOCKING_ENABLED) {
    const { server } = await import('@/mocks/server');
    server.listen({ onUnhandledRequest: 'bypass' });
  }
}
