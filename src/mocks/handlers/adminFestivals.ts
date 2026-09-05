import { http, HttpResponse } from 'msw';
import type { AdminFestival, FestivalPublishResponse } from '@/features/admin/festival/types';
import type { PageResponse } from '@/types/api';
import { adminFestivalsFixture } from '@/mocks/fixtures/adminFestivals';
import { paginate, parsePageParams } from '@/mocks/fixtures/pagination';
import { Errors } from '@/mocks/fixtures/errors';

// /api 접두사: DEC-0099. 다른 핸들러와 같은 조립.
const API = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.every-festa.com'}/api`;

/**
 * 관리자 축제 검수 — 화면(features/admin/festival/api.ts)이 실제로 부르는 세 엔드포인트만
 * 만든다. 일괄 발행(POST /admin/festivals/publish, DEC-0100)은 화면이 안 쓴다.
 *
 * 응답 모양은 fixtures/adminFestivals.ts(실서버 캡처)와 api-docs.json을 따른다. 에러 계약도
 * 실서버 실측과 같다 — size 51 → INVALID_PAGE_SIZE, page -1 → INVALID_PAGE (2026-09-05 확인).
 *
 * 발행 상태는 모듈 스코프에 둔다. 서비스 워커는 페이지 로드마다 다시 평가되므로 E2E는
 * page.goto만으로 초기 상태에서 시작한다 — 테스트 간 정리 코드가 필요 없다.
 * ponytail: 모듈 상태 하나. 테스트가 리셋 API를 필요로 하게 되면 그때 핸들러를 더한다.
 */
let festivals: AdminFestival[] = adminFestivalsFixture.map((f) => ({ ...f }));

function toPublishResponse(f: AdminFestival): FestivalPublishResponse {
  // api-docs.json의 FestivalPublishResponse는 publishedAt을 non-null string으로 적었지만
  // 해제(DELETE) 응답은 null이 실려 온다 — 프론트 타입도 그 스키마를 그대로 옮겨 string이다.
  // 화면은 이 값을 읽지 않고 목록을 다시 불러오므로(queries.ts invalidateQueries) 여기서
  // 타입을 억지로 맞추지 않고 실제 값을 낸다.
  return { festivalId: f.festivalId, name: f.name, publishedAt: f.publishedAt as string };
}

function setPublished(id: string, publishedAt: string | null, instance: string) {
  const festivalId = Number(id);
  if (!Number.isInteger(festivalId)) return Errors.invalidPathVariable(instance);
  const target = festivals.find((f) => f.festivalId === festivalId);
  if (!target) return Errors.festivalNotFound(instance);
  // 멱등 — 이미 그 상태여도 200 (api.ts 주석과 DEC-0100의 멱등 판정).
  const updated: AdminFestival = { ...target, publishedAt };
  festivals = festivals.map((f) => (f.festivalId === festivalId ? updated : f));
  return HttpResponse.json(toPublishResponse(updated));
}

export const adminFestivalsHandlers = [
  http.get(`${API}/admin/festivals`, ({ request }) => {
    const url = new URL(request.url);
    const instance = url.pathname;
    const { page, size } = parsePageParams(url.searchParams);
    const published = url.searchParams.get('published');
    const discovery = url.searchParams.get('discovery');
    const q = url.searchParams.get('q');

    if (!Number.isInteger(page) || page < 0) return Errors.invalidPage(instance);
    if (!Number.isInteger(size) || size < 1 || size > 50) return Errors.invalidPageSize(instance);

    let result = festivals;
    if (published === 'true') result = result.filter((f) => f.publishedAt !== null);
    if (published === 'false') result = result.filter((f) => f.publishedAt === null);
    if (discovery) result = result.filter((f) => f.discovery === discovery);
    if (q) result = result.filter((f) => f.name.includes(q));

    return HttpResponse.json<PageResponse<AdminFestival>>(paginate(result, page, size));
  }),

  http.post(`${API}/admin/festivals/:id/publish`, ({ params, request }) =>
    setPublished(params.id as string, new Date().toISOString(), new URL(request.url).pathname),
  ),

  http.delete(`${API}/admin/festivals/:id/publish`, ({ params, request }) =>
    setPublished(params.id as string, null, new URL(request.url).pathname),
  ),
];
