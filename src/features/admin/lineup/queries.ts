import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLineup,
  deleteLineup,
  getLineups,
  updateLineup,
} from "@/features/admin/lineup/api";
import type { LineupFormValues } from "@/features/admin/lineup/types";

// 라인업 변경은 축제 목록의 lineupCount·blockers도 바꾼다 — 두 캐시를 함께 비운다.
const FESTIVALS_KEY = "admin-festivals";
const KEY = "admin-lineups";

export function useAdminLineups(festivalId: number) {
  return useQuery({
    queryKey: [KEY, festivalId],
    queryFn: () => getLineups(festivalId),
  });
}

export function useCreateLineup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ festivalId, values }: { festivalId: number; values: LineupFormValues }) =>
      createLineup(festivalId, values),
    onSuccess: (_, { festivalId }) => {
      client.invalidateQueries({ queryKey: [KEY, festivalId] });
      client.invalidateQueries({ queryKey: [FESTIVALS_KEY] });
    },
  });
}

export function useUpdateLineup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      festivalId,
      lineupId,
      values,
    }: {
      festivalId: number;
      lineupId: number;
      values: LineupFormValues;
    }) => updateLineup(festivalId, lineupId, values),
    onSuccess: (_, { festivalId }) => {
      client.invalidateQueries({ queryKey: [KEY, festivalId] });
      client.invalidateQueries({ queryKey: [FESTIVALS_KEY] });
    },
  });
}

export function useDeleteLineup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ festivalId, lineupId }: { festivalId: number; lineupId: number }) =>
      deleteLineup(festivalId, lineupId),
    onSuccess: (_, { festivalId }) => {
      client.invalidateQueries({ queryKey: [KEY, festivalId] });
      client.invalidateQueries({ queryKey: [FESTIVALS_KEY] });
    },
  });
}
