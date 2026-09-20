import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";
import { FestivalFormDialog } from "./FestivalFormDialog";
import type { AdminFestivalDetail } from "../types";

const hosts = vi.hoisted(() => ({
  data: [] as { hostId: number; name: string }[],
  isPending: false, isError: false, refetch: vi.fn(),
}));
vi.mock("@/features/admin/host/queries", () => ({ useAllAdminHosts: () => hosts }));
beforeEach(() => {
  hosts.data = [];
  hosts.isPending = false;
  hosts.isError = false;
});

function render(festival: AdminFestivalDetail | null = null) {
  return renderToStaticMarkup(
    <FestivalFormDialog festival={festival} onSubmit={() => {}} onClose={() => {}} />,
  );
}

it("전체 조회 결과의 51번째 주최도 선택지에 넣는다", () => {
  hosts.data = Array.from({ length: 51 }, (_, i) => ({ hostId: i + 1, name: `학교 ${i + 1}` }));
  expect(render()).toContain('<option value="51">학교 51</option>');
});

it("목록이 로딩 중이어도 수정 중인 주최 선택을 유지한다", () => {
  hosts.isPending = true;
  const festival: AdminFestivalDetail = {
    festivalId: 1, name: "축제", hostId: 51, hostName: "기존 학교", importKey: null,
    startDate: "2026-05-01", endDate: "2026-05-02", posterUrl: null, description: null,
    venueName: null, address: null, latitude: null, longitude: null, externalVisitor: null,
    verification: null, ticketType: null, ticketOpenAt: null, admissionNote: null,
    instagramUrl: null, publishedAt: null, lineupCount: 0, blockers: [],
  };
  const html = render(festival);
  expect(html).toContain('<option value="51" selected="">기존 학교</option>');
  expect(html).toContain("주최 목록을 불러오는 중");
});

it("조회 실패 시 빈 목록처럼 숨기지 않고 재시도를 안내한다", () => {
  hosts.isError = true;
  const html = render();
  expect(html).toContain('role="alert"');
  expect(html).toContain("주최 목록을 불러오지 못했습니다.");
  expect(html).toContain("다시 시도");
});
