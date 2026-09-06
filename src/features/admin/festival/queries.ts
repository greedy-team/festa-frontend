import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFestival,
  deleteFestival,
  getFestival,
  getFestivals,
  publishFestival,
  unpublishFestival,
  updateFestival,
} from "@/features/admin/festival/api";
import type {
  FestivalFormValues,
  FestivalReviewParams,
} from "@/features/admin/festival/types";

const KEY = "admin-festivals";

export function useAdminFestivals(params: FestivalReviewParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => getFestivals(params),
  });
}

export function usePublishFestival() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: publishFestival,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUnpublishFestival() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: unpublishFestival,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

/** 수정 폼을 채우는 값 (DEC-0140). null이면 등록 모드라 조회하지 않는다 */
export function useAdminFestival(festivalId: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", festivalId],
    queryFn: () => getFestival(festivalId as number),
    enabled: festivalId !== null,
  });
}

export function useCreateFestival() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values: FestivalFormValues) => createFestival(values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateFestival() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ festivalId, values }: { festivalId: number; values: FestivalFormValues }) =>
      updateFestival(festivalId, values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteFestival() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteFestival,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}
