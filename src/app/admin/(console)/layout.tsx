import { AdminShell } from "@/components/layout/AdminShell";
import { AdminGuard } from "@/features/admin/auth/components/AdminGuard";

export default function ConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
