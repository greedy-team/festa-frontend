import { beforeEach, expect, it, vi } from "vitest";
import { adminFetch } from "@/lib/adminFetch";
import { getAllHosts } from "./api";

vi.mock("@/lib/adminFetch", () => ({ adminFetch: vi.fn() }));
const fetchMock = vi.mocked(adminFetch);
beforeEach(() => fetchMock.mockReset());

it("주최가 51개면 다음 페이지까지 읽고 서버 상한 50을 지킨다", async () => {
  const first = Array.from({ length: 50 }, (_, i) => ({ hostId: i + 1, name: `학교 ${i + 1}` }));
  const last = { hostId: 51, name: "마지막 학교" };
  fetchMock.mockResolvedValueOnce({ items: first, hasNext: true })
    .mockResolvedValueOnce({ items: [last], hasNext: false });
  expect(await getAllHosts()).toEqual([...first, last]);
  expect(fetchMock.mock.calls.map(([path]) => path)).toEqual([
    "/admin/hosts?page=0&size=50", "/admin/hosts?page=1&size=50",
  ]);
});

it("빈 목록이면 첫 페이지에서 끝낸다", async () => {
  fetchMock.mockResolvedValueOnce({ items: [], hasNext: false });
  expect(await getAllHosts()).toEqual([]);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("뒤 페이지 조회 실패를 불완전한 선택지로 숨기지 않는다", async () => {
  fetchMock.mockResolvedValueOnce({ items: [{ hostId: 1 }], hasNext: true })
    .mockRejectedValueOnce(new Error("조회 실패"));
  await expect(getAllHosts()).rejects.toThrow("조회 실패");
});
