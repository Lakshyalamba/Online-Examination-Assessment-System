import Link from "next/link";
import type { ReactNode } from "react";

import { ContentCanvas, PageContainer } from "@/components/ui/shell-primitives";
import { routes } from "@/lib/routes";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="shell-frame shell-frame--public">
      <PageContainer className="shell-frame__container" width="wide">
        <header className="shell-header">
          <div className="shell-header__brand">
            <p className="shell-eyebrow">Public shell baseline</p>
            <h1>Online Examination Assessment System</h1>
          </div>
          <nav className="shell-links" aria-label="Public navigation">
            <Link href={routes.home}>Landing</Link>
            <Link href={routes.login}>Login</Link>
          </nav>
        </header>
        <ContentCanvas as="main" className="public-shell__main" layout="split">
          {children}
        </ContentCanvas>
      </PageContainer>
    </div>
  );
}
