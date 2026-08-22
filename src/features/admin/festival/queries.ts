import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFestivalCounts,
  getFestivals,
  publishFestivals,
  unpublishFestival,
} from "@/features/admin/festival/api";
import type { FestivalReviewParams } from "@/features/admin/festival/types";

const KEY = "admin-festivals";

export function useAdminFestivals(params: FestivalReviewParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => getFestivals(params),
  });
}

export function useFestivalCounts() {
  return useQuery({ queryKey: [KEY, "counts"], queryFn: getFestivalCounts });
}

export function usePublishFestivals() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: publishFestivals,
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
