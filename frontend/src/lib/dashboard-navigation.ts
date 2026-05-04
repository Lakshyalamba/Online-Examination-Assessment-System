import { routes } from "@oeas/backend/lib/routes";
import type { AppRole } from "@oeas/backend/modules/auth/types";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  FileText,
  Library,
  GraduationCap,
  CheckCircle,
  BarChart,
  ClipboardList,
  User,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  headerTitle?: string;
};

export type DashboardNavSection = {
  label: string;
  items: DashboardNavItem[];
};

type DashboardRoleConfig = {
  role: AppRole;
  roleLabel: string;
  shellEyebrow: string;
  shellTitle: string;
  homeHref: string;
  sections: DashboardNavSection[];
};

type DashboardItemWithSection = DashboardNavItem & {
  sectionLabel: string;
};

type DashboardBreadcrumb = {
  label: string;
  href?: string;
};

const dashboardNavigationByRole: Record<AppRole, DashboardRoleConfig> = {
  ADMIN: {
    role: "ADMIN",
    roleLabel: "Admin",
    shellEyebrow: "Governance shell",
    shellTitle: "Operational control center",
    homeHref: routes.adminDashboard,
    sections: [
      {
        label: "Overview",
        items: [
          {
            label: "Overview",
            href: routes.adminDashboard,
            headerTitle: "Admin Overview",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        label: "Operations",
        items: [
          {
            label: "Users",
            href: routes.adminUsers,
            headerTitle: "User Management",
            icon: Users,
          },
          {
            label: "Audit Logs",
            href: routes.adminAudit,
            icon: ShieldAlert,
          },
          {
            label: "Reports",
            href: routes.adminReports,
            headerTitle: "Operational Reports",
            icon: FileText,
          },
          {
            label: "Question Bank",
            href: routes.adminQuestions,
            icon: Library,
          },
          {
            label: "Exams",
            href: routes.adminExams,
            icon: GraduationCap,
          },
        ],
      },
    ],
  },
  EXAMINER: {
    role: "EXAMINER",
    roleLabel: "Examiner",
    shellEyebrow: "Authoring shell",
    shellTitle: "Assessment authoring workspace",
    homeHref: routes.examinerDashboard,
    sections: [
      {
        label: "Overview",
        items: [
          {
            label: "Overview",
            href: routes.examinerDashboard,
            headerTitle: "Examiner Overview",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        label: "Authoring",
        items: [
          {
            label: "Question Bank",
            href: routes.examinerQuestions,
            icon: Library,
          },
          {
            label: "Exams",
            href: routes.examinerExams,
            icon: GraduationCap,
          },
        ],
      },
      {
        label: "Review",
        items: [
          {
            label: "Grading",
            href: routes.examinerGrading,
            icon: CheckCircle,
          },
          {
            label: "Analytics",
            href: routes.examinerAnalytics,
            icon: BarChart,
          },
        ],
      },
    ],
  },
  STUDENT: {
    role: "STUDENT",
    roleLabel: "Student",
    shellEyebrow: "Exam shell",
    shellTitle: "Personal assessment workspace",
    homeHref: routes.studentDashboard,
    sections: [
      {
        label: "Overview",
        items: [
          {
            label: "Overview",
            href: routes.studentDashboard,
            headerTitle: "Student Overview",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        label: "Progress",
        items: [
          {
            label: "Exams",
            href: routes.studentExams,
            icon: ClipboardList,
          },
          {
            label: "Results",
            href: routes.studentResults,
            icon: CheckCircle,
          },
          {
            label: "Profile",
            href: routes.studentProfile,
            icon: User,
          },
        ],
      },
    ],
  },
};

export function getDashboardNavigation(role: AppRole) {
  return dashboardNavigationByRole[role];
}

export function getDashboardNavItems(role: AppRole): DashboardItemWithSection[] {
  return getDashboardNavigation(role).sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      sectionLabel: section.label,
    })),
  );
}

export function getDashboardPageContext(role: AppRole, pathname: string) {
  const navigation = getDashboardNavigation(role);
  const items = [...getDashboardNavItems(role)].sort(
    (left, right) => right.href.length - left.href.length,
  );

  const activeItem =
    items.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? items[0];

  const breadcrumbs: DashboardBreadcrumb[] = [
    {
      label: `${navigation.roleLabel} Workspace`,
      href: navigation.homeHref,
    },
  ];

  if (activeItem.href !== navigation.homeHref) {
    breadcrumbs.push({
      label: activeItem.label,
      href: activeItem.href,
    });
  }

  return {
    activeItem,
    breadcrumbs,
    roleLabel: navigation.roleLabel,
    title: activeItem.headerTitle ?? activeItem.label,
  };
}
