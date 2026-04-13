import Link from "next/link";
import type { Session } from "next-auth";

import { SurfaceCard } from "@/components/ui/shell-primitives";
import { routes } from "@/lib/routes";
import { logoutUser } from "@/modules/auth/actions";

type DashboardSessionPanelProps = {
  session: Session | null;
};

export function DashboardSessionPanel({
  session,
}: DashboardSessionPanelProps) {
  if (!session?.user) {
    return (
      <SurfaceCard className="session-panel" tone="tint">
        <div className="session-panel__copy">
          <p className="surface-card__eyebrow">Session status</p>
          <h2>No active session is attached yet.</h2>
          <p>
            Protected routes now resolve before this panel renders. Sign in to
            continue into the authenticated workspace.
          </p>
        </div>
        <div className="session-panel__actions">
          <Link className="button-link button-link--primary" href={routes.login}>
            Sign in
          </Link>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="session-panel" tone="tint">
      <div className="session-panel__copy">
        <p className="surface-card__eyebrow">Session status</p>
        <h2>{`Signed in as ${session.user.name}`}</h2>
        <p>{session.user.email}</p>
      </div>
      <div className="session-panel__meta">
        <span className="session-pill">{session.user.role}</span>
        <span className="session-pill session-pill--success">Active</span>
      </div>
      <form action={logoutUser} className="session-panel__actions">
        <button className="button-link button-link--secondary" type="submit">
          Log out
        </button>
      </form>
    </SurfaceCard>
  );
}
