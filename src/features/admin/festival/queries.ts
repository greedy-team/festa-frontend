import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFestivals,
  publishFestival,
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
