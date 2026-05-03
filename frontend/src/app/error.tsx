"use client";

import Link from "next/link";
import { useEffect } from "react";

import { PageToolbar } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/fallback-states";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      actions={
        <PageToolbar>
          <button className="button-link button-link--primary" onClick={reset} type="button">
            Try again
          </button>
          <Link className="button-link button-link--secondary" href="/">
            Back to landing
          </Link>
        </PageToolbar>
      }
      eyebrow="Application error"
      layout="page"
      title="The page could not be rendered."
    />
  );
}
