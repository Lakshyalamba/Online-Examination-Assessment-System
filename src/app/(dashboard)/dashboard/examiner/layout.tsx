import type { ReactNode } from "react";

import { requireRole } from "@/lib/auth/rbac";
import { routes } from "@/lib/routes";

type ExaminerDashboardLayoutProps = {
  children: ReactNode;
};

export default async function ExaminerDashboardLayout({
  children,
}: ExaminerDashboardLayoutProps) {
  await requireRole("EXAMINER", routes.examinerDashboard);

  return children;
}
