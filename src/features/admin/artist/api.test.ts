import { beforeEach, expect, it, vi } from "vitest";
import { adminFetch } from "@/lib/adminFetch";
import { createArtist, getArtists, updateArtist } from "./api";
import type { ArtistFormValues } from "./types";

vi.mock("@/lib/adminFetch", () => ({ adminFetch: vi.fn() }));
const fetchMock = vi.mocked(adminFetch);
beforeEach(() => fetchMock.mockReset());

it("목록은 검수 필터 없이 검색·장르·정렬·페이지를 전달한다", async () => {
  await getArtists({ q: "싸이", genre: "DANCE", sort: "NAME", page: 1, size: 10 });
  const url = new URL(fetchMock.mock.calls[0][0], "https://example.test");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    q: "싸이", genre: "DANCE", sort: "NAME", page: "1", size: "10",
  });
});

it("등록·수정은 검수 필드 없이 나머지 폼 값을 전달한다", async () => {
  const values: ArtistFormValues = {
    name: "PSY", otherNames: ["싸이"], genre: "", instagramUrl: "",
  };
  await createArtist(values);
  await updateArtist(7, values);
  expect(fetchMock.mock.calls.map(([path, options]) => [path, options?.method])).toEqual([
    ["/admin/artists", "POST"], ["/admin/artists/7", "PATCH"],
  ]);
  for (const [, options] of fetchMock.mock.calls) {
    expect(JSON.parse(options?.body as string)).toEqual({ ...values, genre: null });
  }
});
