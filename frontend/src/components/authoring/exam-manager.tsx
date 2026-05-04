"use client";

import { useState, type FormEvent } from "react";

import type {
  PersistedExamListItem,
  PersistedQuestion,
  StudentAssignmentCandidate,
} from "@/lib/server/assessment-service";
import { draftExamSchema } from "@/modules/exams/validation/exam.schemas";

type ExamManagerProps = {
  initialExams: PersistedExamListItem[];
  questions: PersistedQuestion[];
  students: StudentAssignmentCandidate[];
};

type SelectedQuestion = {
  questionId: string;
  marks: string;
};

type DraftState = {
  title: string;
  code: string;
  instructionsText: string;
  durationMinutes: string;
  windowStartsAt: string;
  windowEndsAt: string;
  status: "DRAFT" | "SCHEDULED";
  selectedQuestions: SelectedQuestion[];
  selectedStudentIds: string[];
};

const emptyDraft = (): DraftState => {
  const start = new Date(Date.now() + 10 * 60 * 1000);
  const end = new Date(Date.now() + 100 * 60 * 1000);
  const toLocal = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return {
    title: "",
    code: "",
    instructionsText: "Read every question carefully before answering.",
    durationMinutes: "60",
    windowStartsAt: toLocal(start),
    windowEndsAt: toLocal(end),
    status: "DRAFT",
    selectedQuestions: [],
    selectedStudentIds: [],
  };
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

  return "Request failed. Please try again.";
}

export function ExamManager({
  initialExams,
  questions,
  students,
}: ExamManagerProps) {
  const [exams, setExams] = useState(initialExams);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const refreshExams = async () => {
    const response = await fetch("/api/exams", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(parseApiError(payload));
    }

    setExams(payload.data);
  };

  const toggleQuestion = (questionId: string) => {
    setDraft((current) => {
      const selected = current.selectedQuestions.some(
        (question) => question.questionId === questionId,
      );

      return {
        ...current,
        selectedQuestions: selected
          ? current.selectedQuestions.filter(
              (question) => question.questionId !== questionId,
            )
          : [...current.selectedQuestions, { questionId, marks: "2" }],
      };
    });
  };

  const toggleStudent = (studentId: string) => {
    setDraft((current) => ({
      ...current,
      selectedStudentIds: current.selectedStudentIds.includes(studentId)
        ? current.selectedStudentIds.filter((id) => id !== studentId)
        : [...current.selectedStudentIds, studentId],
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const mappedQuestions = draft.selectedQuestions
      .map((selection, index) => {
        const question = questions.find((entry) => entry.id === selection.questionId);

        if (!question) {
          return null;
        }

        return {
          examQuestionId: `eq-${index + 1}`,
          questionOrder: index + 1,
          marks: selection.marks,
          snapshot: {
            sourceQuestionId: question.id,
            stem: question.stem,
            type: question.type,
            difficulty: question.difficulty,
            topicId: question.topicId,
            topicName: question.topicName,
            reviewMode: question.reviewMode,
          },
        };
      })
      .filter(Boolean);

    const assignments = draft.selectedStudentIds
      .map((studentId, index) => {
        const student = students.find((candidate) => candidate.userId === studentId);

        if (!student) {
          return null;
        }

        return {
          assignmentId: `assignment-${index + 1}`,
          studentId: student.userId,
          studentName: student.name,
          studentEmail: student.email,
          department: student.department,
          studentRole: student.role,
          studentStatus: student.status,
        };
      })
      .filter(Boolean);

    const payload = {
      title: draft.title,
      code: draft.code,
      instructions: draft.instructionsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      durationMinutes: draft.durationMinutes,
      windowStartsAt: draft.windowStartsAt,
      windowEndsAt: draft.windowEndsAt,
      sections: [
        {
          sectionId: "section-1",
          title: "Section 1",
          sectionOrder: 1,
          questions: mappedQuestions,
        },
      ],
      assignments,
      status: draft.status,
    };

    const parsed = draftExamSchema.safeParse(payload);

    if (!parsed.success) {
      setSaving(false);
      setStatus({
        tone: "error",
        message: parsed.error.issues.map((issue) => issue.message).join(" "),
      });
      return;
    }

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const responsePayload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(responsePayload));
      }

      await refreshExams();
      setDraft(emptyDraft());
      setStatus({ tone: "success", message: "Exam saved and assignments persisted." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to save exam.",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteExamById = async (examId: string) => {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }

      await refreshExams();
      setStatus({ tone: "success", message: "Exam deleted." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to delete exam.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateExamStatus = async (
    examId: string,
    status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "CLOSED" | "ARCHIVED",
  ) => {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(payload));
      }

      await refreshExams();
      setStatus({ tone: "success", message: "Exam status updated." });
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Unable to update exam.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="authoring-workspace">
      <section className="surface-card authoring-card">
        <p className="surface-card__eyebrow">Exam Management</p>
        <h2>Create exams with sections, mapped questions, and assignments</h2>
        <form className="authoring-form" onSubmit={submit}>
          <div className="authoring-form__grid">
          <label className="authoring-field authoring-field--wide">
            <span>Title</span>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
            />
          </label>
          <label className="authoring-field">
            <span>Code</span>
            <input
              value={draft.code}
              onChange={(event) =>
                setDraft((current) => ({ ...current, code: event.target.value }))
              }
              placeholder="DBMS-301"
            />
          </label>
          <label className="authoring-field">
            <span>Duration minutes</span>
            <input
              min={1}
              type="number"
              value={draft.durationMinutes}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  durationMinutes: event.target.value,
                }))
              }
            />
          </label>
          <label className="authoring-field">
            <span>Window starts</span>
            <input
              type="datetime-local"
              value={draft.windowStartsAt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  windowStartsAt: event.target.value,
                }))
              }
            />
          </label>
          <label className="authoring-field">
            <span>Window ends</span>
            <input
              type="datetime-local"
              value={draft.windowEndsAt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  windowEndsAt: event.target.value,
                }))
              }
            />
          </label>
          <label className="authoring-field">
            <span>Status</span>
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as DraftState["status"],
                }))
              }
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </label>
          <label className="authoring-field authoring-field--wide">
            <span>Instructions</span>
            <textarea
              rows={4}
              value={draft.instructionsText}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  instructionsText: event.target.value,
                }))
              }
            />
          </label>
          </div>

          <div className="authoring-picker">
            <h3>Section 1 questions</h3>
            {questions.map((question) => {
              const selected = draft.selectedQuestions.find(
                (selection) => selection.questionId === question.id,
              );
              return (
                <label className="authoring-picker__row" key={question.id}>
                  <span className="authoring-picker__main">
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => toggleQuestion(question.id)}
                    />{" "}
                    {question.stem}
                  </span>
                  {selected ? (
                    <input
                      type="number"
                      min={1}
                      value={selected.marks}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          selectedQuestions: current.selectedQuestions.map(
                            (selection) =>
                              selection.questionId === question.id
                                ? { ...selection, marks: event.target.value }
                                : selection,
                          ),
                        }))
                      }
                    />
                  ) : null}
                </label>
              );
            })}
          </div>

          <div className="authoring-picker">
            <h3>Assignments</h3>
            {students.map((student) => (
              <label className="authoring-picker__row" key={student.userId}>
                <span className="authoring-picker__main">
                  <input
                    type="checkbox"
                    checked={draft.selectedStudentIds.includes(student.userId)}
                    onChange={() => toggleStudent(student.userId)}
                  />{" "}
                  {student.name} ({student.email})
                </span>
              </label>
            ))}
          </div>

          {status ? (
            <p className={status.tone === "error" ? "authoring-alert authoring-alert--error" : "authoring-alert authoring-alert--success"}>
              {status.message}
            </p>
          ) : null}

          <div className="authoring-actions">
            <button className="button-link" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Create exam"}
            </button>
          </div>
        </form>
      </section>

      <section className="surface-card authoring-card">
        <p className="surface-card__eyebrow">{exams.length} saved exams</p>
        <div className="authoring-record-list">
          {exams.map((exam) => (
            <article className="authoring-record" key={exam.id}>
              <h3>{exam.title}</h3>
              <p>
                {exam.code} · {exam.status} · {exam.questionCount} questions ·{" "}
                {exam.totalMarks} marks · {exam.assignmentCount} assignments
              </p>
              <p>
                {new Date(exam.windowStartsAt).toLocaleString()} to{" "}
                {new Date(exam.windowEndsAt).toLocaleString()}
              </p>
              <div className="authoring-actions">
              <button
                className="button-link button-link--secondary"
                type="button"
                onClick={() => deleteExamById(exam.id)}
              >
                Delete
              </button>
              <button
                className="button-link button-link--secondary"
                type="button"
                onClick={() =>
                  updateExamStatus(
                    exam.id,
                    exam.status === "ARCHIVED" ? "SCHEDULED" : "ARCHIVED",
                  )
                }
              >
                {exam.status === "ARCHIVED" ? "Restore" : "Archive"}
              </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
