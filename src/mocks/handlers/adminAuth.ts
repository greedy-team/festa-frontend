import { http, HttpResponse } from 'msw';
import { apiError } from '@/mocks/fixtures/errors';

// /api 접두사: 2026-08-23 백엔드 결정(DEC-0099)이 DEC-0084(접두사 없음)를 대체했다.
const API = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.festa.kr'}/api`;

/**
 * 실제 계정은 백엔드의 AdminAccountSeeder가 환경변수로 심는다. 서버를 띄우지 않고
 * 화면을 돌리기 위한 값이므로, 서버가 로컬에 뜨면 이 핸들러 대신 그쪽이 응답한다
 * (NEXT_PUBLIC_API_MOCKING=false).
 */
const DEV_ACCOUNT = { username: 'admin', password: 'admin' } as const;

/** DEC-0086: 액세스 토큰 수명 1시간, 리프레시 없음 */
const TOKEN_TTL_SECONDS = 3600;

export const adminAuthHandlers = [
  http.post(`${API}/admin/auth/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (username !== DEV_ACCOUNT.username || password !== DEV_ACCOUNT.password) {
      // DEC-0085: 실패는 ADMIN_INVALID_CREDENTIALS 하나로 뭉친다. 계정 존재 여부를
      // 코드로 가르지 않는다.
      return apiError(
        'ADMIN_INVALID_CREDENTIALS',
        'invalid admin credentials',
        401,
        '/api/admin/auth/login'
      );
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      expiresIn: TOKEN_TTL_SECONDS,
    });
  }),
];
