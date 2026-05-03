import type { ReactNode } from "react";

import { ContentCanvas, PageContainer } from "@/components/ui/shell-primitives";
import { PublicHeader } from "@/components/layout/public-header";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="shell-frame shell-frame--public">
      <PublicHeader />
      <PageContainer className="shell-frame__container" width="wide" style={{ paddingTop: "80px" }}>
        <ContentCanvas
          as="main"
          className="public-shell__main"
          id="app-main-content"
          tabIndex={-1}
        >
          {children}
        </ContentCanvas>
      </PageContainer>
    </div>
  );
}
