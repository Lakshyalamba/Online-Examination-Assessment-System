"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { PersistedQuestion } from "@/lib/server/assessment-service";
import { questionAuthoringSchema } from "@/modules/questions/validation/question.schemas";
import type {
  QuestionDifficulty,
  QuestionType,
} from "@/modules/questions/domain/question.types";

type QuestionBankManagerProps = {
  initialQuestions: PersistedQuestion[];
};

const questionTypes: QuestionType[] = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_TEXT",
  "LONG_TEXT",
];

const difficulties: QuestionDifficulty[] = ["EASY", "MEDIUM", "HARD"];

const createDefaultOptions = (type: QuestionType) =>
  type === "TRUE_FALSE"
    ? [
        { label: "A", text: "True", isCorrect: true, optionOrder: 1 },
        { label: "B", text: "False", isCorrect: false, optionOrder: 2 },
      ]
    : [
        { label: "A", text: "", isCorrect: true, optionOrder: 1 },
        { label: "B", text: "", isCorrect: false, optionOrder: 2 },
        { label: "C", text: "", isCorrect: false, optionOrder: 3 },
        { label: "D", text: "", isCorrect: false, optionOrder: 4 },
      ];

const isObjective = (type: QuestionType) =>
  type === "SINGLE_CHOICE" ||
  type === "MULTIPLE_CHOICE" ||
  type === "TRUE_FALSE";

type DraftState = {
  id: string | null;
  type: QuestionType;
  stem: string;
  difficulty: QuestionDifficulty;
  topicId: string;
  explanation: string;
  expectedAnswer: string;
  options: Array<{
    id?: string;
    label: string;
    text: string;
    isCorrect: boolean;
    optionOrder: number;
  }>;
};

const emptyDraft = (): DraftState => ({
  id: null,
  type: "SINGLE_CHOICE",
  stem: "",
  difficulty: "EASY",
  topicId: "algorithms",
  explanation: "",
  expectedAnswer: "",
  options: createDefaultOptions("SINGLE_CHOICE"),
});

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

  return "Request failed. Please try again.";
}

export function QuestionBankManager({
  initialQuestions,
}: QuestionBankManagerProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const topics = useMemo(
    () =>
      Array.from(
        new Map(
          questions.map((question) => [
            question.topicId,
            { id: question.topicId, name: question.topicName },
          ]),
        ).values(),
      ),
    [questions],
  );

  const refreshQuestions = async () => {
    const response = await fetch("/api/questions", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(parseApiError(payload));
    }

    setQuestions(payload.data);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const payload = isObjective(draft.type)
      ? {
          type: draft.type,
          stem: draft.stem,
          difficulty: draft.difficulty,
          topicId: draft.topicId,
          explanation: draft.explanation,
          options: draft.options,
        }
      : {
          type: draft.type,
          stem: draft.stem,
          difficulty: draft.difficulty,
          topicId: draft.topicId,
          explanation: draft.explanation,
          expectedAnswer: draft.expectedAnswer,
        };

    const parsed = questionAuthoringSchema.safeParse(payload);

    if (!parsed.success) {
      setSaving(false);
      setStatus({
        tone: "error",
        message: parsed.error.issues.map((issue) => issue.message).join(" "),
      });
      return;
    }

    try {
      const response = await fetch(
        draft.id ? `/api/questions/${draft.id}` : "/api/questions",
        {
          method: draft.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const responsePayload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(responsePayload));
      }

      await refreshQuestions();
      setDraft(emptyDraft());
      setStatus({
        tone: "success",
        message: draft.id ? "Question updated." : "Question saved to the bank.",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to save question.",
      });
    } finally {
      setSaving(false);
    }
  };

  const editQuestion = (question: PersistedQuestion) => {
    setDraft({
      id: question.id,
      type: question.draft.type,
      stem: question.draft.stem,
      difficulty: question.draft.difficulty,
      topicId: question.draft.topicId,
      explanation: question.draft.explanation ?? "",
      expectedAnswer:
        "expectedAnswer" in question.draft ? question.draft.expectedAnswer : "",
      options:
        "options" in question.draft
          ? question.draft.options
          : createDefaultOptions(question.draft.type),
    });
    setStatus(null);
  };

  const deleteQuestionById = async (questionId: string) => {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }

      await refreshQuestions();
      setStatus({ tone: "success", message: "Question deleted." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to delete question.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateType = (type: QuestionType) => {
    setDraft((current) => ({
      ...current,
      type,
      options: isObjective(type) ? createDefaultOptions(type) : current.options,
    }));
  };

  const updateOption = (
    index: number,
    patch: Partial<DraftState["options"][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => {
        if (optionIndex !== index) {
          if (
            patch.isCorrect &&
            current.type !== "MULTIPLE_CHOICE" &&
            option.isCorrect
          ) {
            return { ...option, isCorrect: false };
          }
          return option;
        }

        return { ...option, ...patch };
      }),
    }));
  };

  return (
    <div className="authoring-workspace">
      <section className="surface-card authoring-card">
        <p className="surface-card__eyebrow">Question Bank</p>
        <h2>Create or update reusable questions</h2>
        <form className="authoring-form" onSubmit={submit}>
          <div className="authoring-form__grid">
          <label className="authoring-field">
            <span>Type</span>
            <select value={draft.type} onChange={(event) => updateType(event.target.value as QuestionType)}>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="authoring-field">
            <span>Topic</span>
            <input
              list="question-topics"
              value={draft.topicId}
              onChange={(event) =>
                setDraft((current) => ({ ...current, topicId: event.target.value }))
              }
              placeholder="algorithms"
            />
            <datalist id="question-topics">
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </datalist>
          </label>
          <label className="authoring-field">
            <span>Difficulty</span>
            <select
              value={draft.difficulty}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  difficulty: event.target.value as QuestionDifficulty,
                }))
              }
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </label>
          <label className="authoring-field authoring-field--wide">
            <span>Question stem</span>
            <textarea
              rows={4}
              value={draft.stem}
              onChange={(event) =>
                setDraft((current) => ({ ...current, stem: event.target.value }))
              }
            />
          </label>
          <label className="authoring-field authoring-field--wide">
            <span>Explanation</span>
            <textarea
              rows={3}
              value={draft.explanation}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  explanation: event.target.value,
                }))
              }
            />
          </label>
          </div>

          {isObjective(draft.type) ? (
            <div className="authoring-option-grid">
              {draft.options.map((option, index) => (
                <label className="authoring-option" key={option.label}>
                  <span className="authoring-option__header">
                    Option {option.label}
                    <input
                      type={draft.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                      name="correct-option"
                      checked={option.isCorrect}
                      onChange={(event) =>
                        updateOption(index, { isCorrect: event.target.checked })
                      }
                    />
                  </span>
                  <input
                    value={option.text}
                    disabled={draft.type === "TRUE_FALSE"}
                    onChange={(event) =>
                      updateOption(index, { text: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
          ) : (
            <label className="authoring-field">
              <span>Expected answer</span>
              <textarea
                rows={4}
                value={draft.expectedAnswer}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    expectedAnswer: event.target.value,
                  }))
                }
              />
            </label>
          )}

          {status ? (
            <p className={status.tone === "error" ? "authoring-alert authoring-alert--error" : "authoring-alert authoring-alert--success"}>
              {status.message}
            </p>
          ) : null}

          <div className="authoring-actions">
            <button className="button-link" type="submit" disabled={saving}>
              {saving ? "Saving..." : draft.id ? "Update question" : "Create question"}
            </button>
            {draft.id ? (
              <button
                className="button-link button-link--secondary"
                type="button"
                onClick={() => setDraft(emptyDraft())}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="surface-card authoring-card">
        <p className="surface-card__eyebrow">{questions.length} saved questions</p>
        <div className="authoring-record-list">
          {questions.map((question) => (
            <article className="authoring-record" key={question.id}>
              <h3>{question.stem}</h3>
              <p>
                {question.type.replaceAll("_", " ")} · {question.difficulty} ·{" "}
                {question.topicName} · used in {question.usageCount} exam
                {question.usageCount === 1 ? "" : "s"}
              </p>
              <p>{question.answerPreview.join(", ") || "Manual answer"}</p>
              <div className="authoring-actions">
                <button className="button-link button-link--secondary" type="button" onClick={() => editQuestion(question)}>
                  Edit
                </button>
                <button className="button-link button-link--secondary" type="button" onClick={() => deleteQuestionById(question.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
