import type { ReactNode } from "react";

import {
  ContentCanvas,
  PageContainer,
  SurfaceCard,
} from "@/components/ui/shell-primitives";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="shell-frame shell-frame--auth">
      <PageContainer className="shell-frame__container">
        <ContentCanvas className="auth-shell__canvas" layout="split">
          <SurfaceCard className="auth-shell__intro" tone="tint">
            <p className="surface-card__eyebrow">Auth route group</p>
            <div className="surface-card__content">
              <div className="surface-card__copy">
                <h1>Secure entry for shared exam operations</h1>
                <p>
                  Step 1 sets the authentication shell and entry route. Session
                  wiring, credential checks, and redirects land in later
                  prompts.
                </p>
              </div>
              <ul className="surface-card__list">
                <li>One auth entry point for all roles</li>
                <li>Protected route behavior arrives after session plumbing</li>
                <li>UI remains intentionally minimal at this stage</li>
              </ul>
            </div>
          </SurfaceCard>
          <main className="auth-shell__main">{children}</main>
        </ContentCanvas>
      </PageContainer>
    </div>
  );
}
