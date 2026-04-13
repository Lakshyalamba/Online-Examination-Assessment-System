import type { ReactNode } from "react";

import { routes } from "@/lib/routes";
import { requireRole } from "@/lib/auth/rbac";

type AdminDashboardLayoutProps = {
  children: ReactNode;
};

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  await requireRole("ADMIN", routes.adminDashboard);

  return children;
}
