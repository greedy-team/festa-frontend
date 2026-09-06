import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commitImport,
  getImportHistory,
  uploadBundle,
  type BundleUpload,
  type HistoryParams,
} from "@/features/admin/import/api";
import type { ImportSection } from "@/features/admin/import/types";

const KEY = "admin-imports";

export function useUploadBundle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (upload: BundleUpload) => uploadBundle(upload),
    // 업로드는 PENDING 이력을 만든다 — 이력 화면 캐시를 비운다.
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useCommitImport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      importId,
      lines,
    }: {
      importId: number;
      lines: Partial<Record<ImportSection, number[]>>;
    }) => commitImport(importId, lines),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] });
      // 커밋은 축제·라인업·아티스트를 만든다 — 각 목록 캐시를 비운다.
      client.invalidateQueries({ queryKey: ["admin-festivals"] });
      client.invalidateQueries({ queryKey: ["admin-artists"] });
      client.invalidateQueries({ queryKey: ["admin-hosts"] });
    },
  });
}

export function useImportHistory(params: HistoryParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => getImportHistory(params),
  });
}
