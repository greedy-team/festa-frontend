import type { Metadata } from "next";
import { AdminProviders } from "@/app/admin/providers";

// noindex는 접근 제어가 아니다 — 실제 보호는 백엔드 인증이 붙어야 시작된다. 지금은
// 픽스처만 있는 화면이지만, 인덱싱된 "FESTA 관리자" 페이지가 프로덕션 도메인에 뜨는
// 것 자체는 막아둔다.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminProviders>{children}</AdminProviders>;
}
