"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

import { getDashboardPageContext } from "@/lib/dashboard-navigation";
import type { AppRole } from "@/modules/auth/types";

type DashboardTopbarProps = {
  role: AppRole;
};

export function DashboardTopbar({ role }: DashboardTopbarProps) {
  const pathname = usePathname();
  const context = getDashboardPageContext(role, pathname);

  return (
    <div className="dashboard-topbar">
      <nav aria-label="Breadcrumb" className="dashboard-breadcrumbs">
        {context.breadcrumbs.map((crumb, index) => {
          const isCurrent = index === context.breadcrumbs.length - 1;

          return (
            <Fragment key={`${crumb.label}-${crumb.href ?? "current"}`}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="dashboard-breadcrumbs__separator"
                >
                  /
                </span>
              ) : null}
              {crumb.href && !isCurrent ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {crumb.label}
                </span>
              )}
            </Fragment>
          );
        })}
      </nav>

      <div className="dashboard-topbar__copy">
        <p className="shell-eyebrow">{`${context.roleLabel} / ${context.activeItem.sectionLabel}`}</p>
        <h1>{context.title}</h1>
        <p>{context.description}</p>
      </div>
    </div>
  );
}
