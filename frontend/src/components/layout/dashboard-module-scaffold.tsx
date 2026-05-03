import Link from "next/link";

import { PageHeader, PageToolbar } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/fallback-states";
import { SurfaceCard } from "@/components/ui/shell-primitives";
import type { AppRole } from "@oeas/backend/modules/auth/types";

type DashboardModuleScaffoldProps = {
  role: AppRole;
  title: string;
  backHref: string;
  nextSteps: string[];
};

export function DashboardModuleScaffold({
  role,
  title,
  backHref,
  nextSteps,
}: DashboardModuleScaffoldProps) {
  return (
    <div className="dashboard-module-scaffold">
      <SurfaceCard>
        <PageHeader
          actions={
            <PageToolbar align="end">
              <Link className="button-link button-link--secondary" href={backHref}>
                Back to overview
              </Link>
            </PageToolbar>
          }
          eyebrow={`${role} module`}
          title={title}
        />
      </SurfaceCard>

      <EmptyState
        actions={
          <PageToolbar>
            <Link className="button-link button-link--secondary" href={backHref}>
              Back to overview
            </Link>
          </PageToolbar>
        }
        eyebrow="Empty state baseline"
        title="No module content is connected yet."
      />

      <SurfaceCard>
        <p className="surface-card__eyebrow">Next steps</p>
        <ul className="surface-card__list">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}
