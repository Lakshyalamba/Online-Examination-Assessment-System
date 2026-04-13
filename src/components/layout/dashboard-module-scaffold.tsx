import Link from "next/link";

import { SurfaceCard } from "@/components/ui/shell-primitives";
import type { AppRole } from "@/modules/auth/types";

type DashboardModuleScaffoldProps = {
  role: AppRole;
  title: string;
  description: string;
  backHref: string;
  nextSteps: string[];
};

export function DashboardModuleScaffold({
  role,
  title,
  description,
  backHref,
  nextSteps,
}: DashboardModuleScaffoldProps) {
  return (
    <div className="dashboard-module-scaffold">
      <SurfaceCard>
        <p className="surface-card__eyebrow">{`${role} module`}</p>
        <div className="surface-card__content">
          <div className="surface-card__copy">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <div className="dashboard-module-scaffold__actions">
            <Link className="button-link button-link--secondary" href={backHref}>
              Back to overview
            </Link>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard tone="tint">
        <p className="surface-card__eyebrow">Module handoff</p>
        <ul className="surface-card__list">
          {nextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}
