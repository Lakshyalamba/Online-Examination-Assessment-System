import type { ReactNode } from "react";

import { requireRole } from "@/lib/auth/rbac";
import { routes } from "@/lib/routes";

type StudentDashboardLayoutProps = {
  children: ReactNode;
};

export default async function StudentDashboardLayout({
  children,
}: StudentDashboardLayoutProps) {
  await requireRole("STUDENT", routes.studentDashboard);

  return children;
}
