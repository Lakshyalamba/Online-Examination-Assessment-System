import Link from "next/link";
import type { ReactNode } from "react";

import { ContentCanvas, PageContainer } from "@/components/ui/shell-primitives";
import { routes } from "@/lib/routes";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-shell__sidebar">
        <ContentCanvas className="dashboard-shell__sidebar-content">
          <div className="dashboard-shell__brand">
            <p className="shell-eyebrow shell-eyebrow--inverse">
              Dashboard route group
            </p>
            <h1>Shared workspace frame</h1>
            <p>
              This placeholder shell gives later module owners one
              authenticated canvas instead of competing dashboard structures.
            </p>
          </div>
          <nav
            className="dashboard-shell__nav"
            aria-label="Dashboard placeholder navigation"
          >
            <Link href={routes.dashboard}>Entry</Link>
            <span>Role nav lands in step 6</span>
            <span>Guards land in step 5</span>
          </nav>
        </ContentCanvas>
      </aside>
      <main className="dashboard-shell__main">
        <PageContainer className="dashboard-shell__main-container">
          <ContentCanvas>{children}</ContentCanvas>
        </PageContainer>
      </main>
    </div>
  );
}
