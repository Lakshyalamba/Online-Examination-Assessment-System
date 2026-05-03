"use client";

import Link from "next/link";
import { useEffect } from "react";

import { PageToolbar } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/fallback-states";
import { routes } from "@oeas/backend/lib/routes";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      actions={
        <PageToolbar>
          <button className="button-link button-link--primary" onClick={reset} type="button">
            Retry dashboard
          </button>
          <Link className="button-link button-link--secondary" href={routes.dashboard}>
            Back to dashboard
          </Link>
        </PageToolbar>
      }
      eyebrow="Dashboard error"
      title="This dashboard view could not be rendered."
    />
  );
}
