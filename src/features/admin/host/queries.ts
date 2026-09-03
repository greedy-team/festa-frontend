import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHost,
  deleteHost,
  getHost,
  getHosts,
  updateHost,
} from "@/features/admin/host/api";
import type { HostFormValues, HostListParams } from "@/features/admin/host/types";

const KEY = "admin-hosts";

export function useAdminHosts(params: HostListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => getHosts(params),
  });
}

/** 수정 폼을 채우는 값 (DEC-0140). null이면 등록 모드라 조회하지 않는다 */
export function useAdminHost(hostId: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", hostId],
    queryFn: () => getHost(hostId as number),
    enabled: hostId !== null,
  });
}

export function useCreateHost() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values: HostFormValues) => createHost(values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateHost() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, values }: { hostId: number; values: HostFormValues }) =>
      updateHost(hostId, values),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteHost() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteHost,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}
