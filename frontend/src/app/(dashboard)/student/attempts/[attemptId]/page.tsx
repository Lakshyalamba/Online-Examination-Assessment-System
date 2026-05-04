"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import type { AttemptPayload, AttemptQuestion } from "@/lib/server/assessment-service";

type StudentAttemptPageProps = {
  params: Promise<{ attemptId: string }>;
};

type AnswerDraft = Record<
  string,
  { selectedOptionIds: string[]; answerText: string }
>;

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

  return "Request failed.";
}

const isObjective = (question: AttemptQuestion) =>
  question.type === "SINGLE_CHOICE" ||
  question.type === "MULTIPLE_CHOICE" ||
  question.type === "TRUE_FALSE";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

export default function StudentAttemptPage({ params }: StudentAttemptPageProps) {
  const { attemptId } = use(params);
  const [attempt, setAttempt] = useState<AttemptPayload | null>(null);
  const [drafts, setDrafts] = useState<AnswerDraft>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/student/attempts/${attemptId}`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(parseApiError(payload));
        }

        const data = payload.data as AttemptPayload;
        setAttempt(data);
        setDrafts(
          Object.fromEntries(
            data.questions.map((question) => [
              question.examQuestionId,
              {
                selectedOptionIds: question.selectedOptionIds,
                answerText: question.answerText,
              },
            ]),
          ),
        );
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load attempt.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [attemptId]);

  useEffect(() => {
    if (!attempt || submitted) {
      return;
    }

    const tick = () => {
      setRemainingSeconds(
        Math.max(
          0,
          Math.floor(
            (new Date(attempt.expiresAt).getTime() - Date.now()) / 1000,
          ),
        ),
      );
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [attempt, submitted]);

  const submitAttempt = useCallback(async (autoSubmit = false) => {
    setBusy(true);
    setError(null);
    setConfirming(false);

    try {
      const response = await fetch(`/api/student/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoSubmit }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }

      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit attempt.");
    } finally {
      setBusy(false);
    }
  }, [attemptId]);

  useEffect(() => {
    if (attempt && remainingSeconds === 0 && !submitted && !busy) {
      void submitAttempt(true);
    }
  }, [attempt, busy, remainingSeconds, submitAttempt, submitted]);

  const currentQuestion = attempt?.questions[currentIndex] ?? null;
  const currentDraft = currentQuestion ? drafts[currentQuestion.examQuestionId] : null;
  const answeredCount = useMemo(
    () =>
      Object.values(drafts).filter(
        (draft) =>
          draft.selectedOptionIds.length > 0 || draft.answerText.trim() !== "",
      ).length,
    [drafts],
  );

  const saveAnswer = async (
    question: AttemptQuestion,
    nextDraft: AnswerDraft[string],
  ) => {
    setDrafts((current) => ({
      ...current,
      [question.examQuestionId]: nextDraft,
    }));

    try {
      const response = await fetch(`/api/student/attempts/${attemptId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examQuestionId: question.examQuestionId,
          selectedOptionIds: nextDraft.selectedOptionIds,
          answerText: nextDraft.answerText,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save answer.");
    }
  };

  if (loading) {
    return <p>Loading attempt...</p>;
  }

  if (error && !attempt) {
    return (
      <section className="surface-card">
        <p className="auth-form__error">{error}</p>
        <Link className="button-link" href="/dashboard/student/exams">
          Back to exams
        </Link>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="surface-card">
        <p className="surface-card__eyebrow">Submitted</p>
        <h2>Your attempt has been submitted.</h2>
        <p>
          Answered {answeredCount} of {attempt?.questions.length ?? 0} questions.
        </p>
        <Link className="button-link" href={`/student/results/${attemptId}`}>
          View result
        </Link>
      </section>
    );
  }

  if (!attempt || !currentQuestion || !currentDraft) {
    return null;
  }

  return (
    <div className="dashboard-module-scaffold">
      <section className="surface-card">
        <p className="surface-card__eyebrow">Live attempt</p>
        <h2>{attempt.title}</h2>
        <p>
          {attempt.code} · Time left: {formatTime(remainingSeconds)} · Answered{" "}
          {answeredCount}/{attempt.questions.length}
        </p>
        {error ? <p className="auth-form__error">{error}</p> : null}
      </section>

      <section className="surface-card">
        <p className="surface-card__eyebrow">
          Question {currentIndex + 1} of {attempt.questions.length}
        </p>
        <h3>{currentQuestion.stem}</h3>
        <p>{currentQuestion.marks} marks</p>

        {isObjective(currentQuestion) ? (
          <div className="surface-card__list">
            {currentQuestion.options.map((option) => {
              const selected = currentDraft.selectedOptionIds.includes(option.id);
              const multi = currentQuestion.type === "MULTIPLE_CHOICE";
              return (
                <label className="placeholder-panel" key={option.id}>
                  <span>
                    <input
                      checked={selected}
                      name={currentQuestion.examQuestionId}
                      type={multi ? "checkbox" : "radio"}
                      onChange={(event) => {
                        const selectedOptionIds = multi
                          ? event.target.checked
                            ? [...currentDraft.selectedOptionIds, option.id]
                            : currentDraft.selectedOptionIds.filter((id) => id !== option.id)
                          : [option.id];
                        void saveAnswer(currentQuestion, {
                          selectedOptionIds,
                          answerText: "",
                        });
                      }}
                    />{" "}
                    {option.label}. {option.text}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <label className="auth-field">
            <span>Answer</span>
            <textarea
              rows={6}
              value={currentDraft.answerText}
              onChange={(event) =>
                void saveAnswer(currentQuestion, {
                  selectedOptionIds: [],
                  answerText: event.target.value,
                })
              }
            />
          </label>
        )}
      </section>

      <section className="surface-card">
        <p className="surface-card__eyebrow">Question navigation</p>
        <div className="auth-form__actions">
          {attempt.questions.map((question, index) => {
            const draft = drafts[question.examQuestionId];
            const answered =
              draft &&
              (draft.selectedOptionIds.length > 0 || draft.answerText.trim() !== "");
            return (
              <button
                className={
                  index === currentIndex
                    ? "button-link"
                    : "button-link button-link--secondary"
                }
                key={question.examQuestionId}
                type="button"
                onClick={() => setCurrentIndex(index)}
              >
                {question.questionOrder}
                {answered ? " ✓" : ""}
              </button>
            );
          })}
        </div>
        <div className="auth-form__actions">
          <button
            className="button-link button-link--secondary"
            disabled={currentIndex === 0}
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          >
            Previous
          </button>
          <button
            className="button-link button-link--secondary"
            disabled={currentIndex === attempt.questions.length - 1}
            type="button"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(attempt.questions.length - 1, index + 1),
              )
            }
          >
            Next
          </button>
          <button
            className="button-link"
            disabled={busy}
            type="button"
            onClick={() => setConfirming(true)}
          >
            Submit exam
          </button>
        </div>
      </section>

      {confirming ? (
        <section className="surface-card" role="dialog" aria-modal="true">
          <h3>Submit this exam?</h3>
          <p>
            You answered {answeredCount} of {attempt.questions.length} questions.
            You cannot edit answers after submission.
          </p>
          <div className="auth-form__actions">
            <button
              className="button-link"
              disabled={busy}
              type="button"
              onClick={() => void submitAttempt(false)}
            >
              Confirm submit
            </button>
            <button
              className="button-link button-link--secondary"
              type="button"
              onClick={() => setConfirming(false)}
            >
              Keep working
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
