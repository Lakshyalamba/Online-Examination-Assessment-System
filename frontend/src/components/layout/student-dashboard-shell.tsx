import type { ReactNode } from "react";

import { StaticDashboardShell } from "./dashboard-shell";

type StudentDashboardShellProps = {
  children: ReactNode;
  activeHref?: string;
  pageTitle?: string;
};

const studentNavigation = [
  {
    href: "#overview",
    label: "Overview",
  },
  {
    href: "#assigned-exams",
    label: "Assigned Exams",
  },
  {
    href: "#results-summary",
    label: "Results Summary",
  },
];

export function StudentDashboardShell({
  children,
  activeHref = "#overview",
  pageTitle = "Student Dashboard",
}: StudentDashboardShellProps) {
  return (
    <StaticDashboardShell
      roleLabel="Student"
      pageTitle={pageTitle}
      navigation={studentNavigation.map((item) => ({
        ...item,
        isActive: item.href === activeHref,
      }))}
    >
      {children}
    </StaticDashboardShell>
  );
}
