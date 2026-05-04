"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StartExamButtonProps = {
  examId: string;
  disabled?: boolean;
  label?: string;
};

function parseApiError(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error
  ) {
    return String(payload.error.message);
  }

  return "Unable to start exam.";
}

export function StartExamButton({
  examId,
  disabled = false,
  label = "Start exam",
}: StartExamButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/student/exams/${examId}/start`, {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }

      router.push(`/student/attempts/${payload.data.attemptId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start exam.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-form__actions">
      <button
        className="button-link"
        disabled={disabled || busy}
        type="button"
        onClick={start}
      >
        {busy ? "Starting..." : label}
      </button>
      {error ? <p className="auth-form__error">{error}</p> : null}
    </div>
  );
}
