import { SurfaceCard } from "@/components/ui/shell-primitives";
import type { AppRole } from "@/modules/auth/types";

type RoleDashboardEntryProps = {
  role: AppRole;
  title: string;
  description: string;
  handoff: string[];
  denied?: string;
  from?: string;
};

export function RoleDashboardEntry({
  role,
  title,
  description,
  handoff,
  denied,
  from,
}: RoleDashboardEntryProps) {
  return (
    <SurfaceCard className="role-dashboard-entry">
      <div className="role-dashboard-entry__header">
        <p className="surface-card__eyebrow">{`${role} dashboard`}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {denied === "1" ? (
        <p className="form-alert" role="alert">
          {`You do not have access to ${from ?? "that route"}. You were returned to your allowed dashboard.`}
        </p>
      ) : null}

      <ul className="surface-card__list">
        {handoff.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
