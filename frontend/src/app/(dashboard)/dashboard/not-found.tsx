import Link from "next/link";

import { PageToolbar } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/fallback-states";
import { routes } from "@oeas/backend/lib/routes";

export default function DashboardRouteNotFound() {
  return (
    <EmptyState
      actions={
        <PageToolbar>
          <Link className="button-link button-link--primary" href={routes.dashboard}>
            Back to dashboard
          </Link>
          <Link className="button-link button-link--secondary" href={routes.home}>
            Back to landing
          </Link>
        </PageToolbar>
      }
      eyebrow="Dashboard not found"
      title="This dashboard page is not available."
    />
  );
}
