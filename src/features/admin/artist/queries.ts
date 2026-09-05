import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createArtist,
  deleteArtist,
  getArtist,
  getArtists,
  getMergeCandidates,
  mergeArtists,
  updateArtist,
} from "@/features/admin/artist/api";
import type { ArtistFormValues, ArtistListParams } from "@/features/admin/artist/types";

const KEY = "admin-artists";

export function useAdminArtists(params: ArtistListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => getArtists(params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 수정 폼을 채우는 값 (DEC-0140). `artistId`가 null이면 등록 모드라 조회하지 않는다.
 *
 * `staleTime: 0`을 그대로 두는 이유 — 폼을 다시 열 때 캐시된 옛 값으로 채우면
 * 그 값으로 전체를 덮어쓰게 된다 (DEC-0141이 전체 전송이라 부분 수정보다 위험하다).
 */
export function useAdminArtist(artistId: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", artistId],
    queryFn: () => getArtist(artistId as number),
    enabled: artistId !== null,
  });
}

export function useCreateArtist() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values: ArtistFormValues) => createArtist(values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateArtist() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ artistId, values }: { artistId: number; values: ArtistFormValues }) =>
      updateArtist(artistId, values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteArtist() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useMergeCandidates(artistId: number | null) {
  return useQuery({
    queryKey: [KEY, "merge-candidates", artistId],
    queryFn: () => getMergeCandidates(artistId as number),
    enabled: artistId !== null,
  });
}

export function useMergeArtists() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: mergeArtists,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}
