import {
  escapeHtml,
  renderQuestionBankChip,
} from "../../../questions/question-bank/ui/question-bank-ui.shared";
import {
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
} from "../../../questions/utils/question-metadata";
import type { DraftExamSummary } from "../../domain/exam.types";
import {
  formatDraftExamDateTime,
  getDraftExamAssignedStudentCount,
  getDraftExamManualReviewQuestionCount,
  getDraftExamMappedQuestionCount,
  getDraftExamSectionTotalMarks,
  getDraftExamTotalMarks,
  getDraftExamWindowDurationMinutes,
} from "../../create-exam/exam-authoring-form";
import {
  renderExamStatusChip,
  renderExaminerWorkspaceShell,
} from "../../ui/exam-ui.shared";
import type { ExamDetailDemoRecord } from "../exam-detail.records";

export const EXAM_DETAIL_TABS = [
  "overview",
  "questions",
  "assignments",
  "downstream",
] as const;

export type ExamDetailTabId = (typeof EXAM_DETAIL_TABS)[number];

const EXAM_DETAIL_TAB_LABELS: Record<ExamDetailTabId, string> = {
  overview: "Overview",
  questions: "Questions",
  assignments: "Assignments",
  downstream: "Downstream Ready",
};

const toDifficultyTone = (
  difficulty: DraftExamSummary["sections"][number]["questions"][number]["snapshot"]["difficulty"],
) => difficulty.toLowerCase() as "easy" | "medium" | "hard";

const renderInstructionList = (instructions: string[]) =>
  instructions.length === 0
    ? `<p class="exam-authoring-summary__empty">No student-facing instructions have been saved for this exam yet.</p>`
    : `<ol class="exam-authoring-summary__instructions">
        ${instructions
          .map((instruction) => `<li>${escapeHtml(instruction)}</li>`)
          .join("")}
      </ol>`;

const renderStatGrid = (exam: DraftExamSummary) => `
  <dl class="exam-authoring-summary__stats">
    <div>
      <dt>Status</dt>
      <dd>${escapeHtml(exam.status)}</dd>
    </div>
    <div>
      <dt>Window length</dt>
      <dd>${getDraftExamWindowDurationMinutes(exam)} minutes</dd>
    </div>
    <div>
      <dt>Questions</dt>
      <dd>${getDraftExamMappedQuestionCount(exam)}</dd>
    </div>
    <div>
      <dt>Assignments</dt>
      <dd>${getDraftExamAssignedStudentCount(exam)}</dd>
    </div>
    <div>
      <dt>Total marks</dt>
      <dd>${getDraftExamTotalMarks(exam)}</dd>
    </div>
    <div>
      <dt>Manual review</dt>
      <dd>${getDraftExamManualReviewQuestionCount(exam)}</dd>
    </div>
  </dl>
`;

const renderOverviewTab = (exam: DraftExamSummary) => `
  <div class="exam-detail-grid">
    <section class="question-bank-panel exam-authoring-summary exam-detail-panel">
      <p class="exam-authoring-panel__eyebrow">Schedule</p>
      ${renderStatGrid(exam)}
      <p class="exam-authoring-summary__window">${escapeHtml(
        `${formatDraftExamDateTime(exam.windowStartsAt)} to ${formatDraftExamDateTime(
          exam.windowEndsAt,
        )}`,
      )}</p>
    </section>
    <section class="question-bank-panel exam-authoring-summary exam-detail-panel">
      <p class="exam-authoring-panel__eyebrow">Instructions</p>
      <h3>Student guidance</h3>
      ${renderInstructionList(exam.instructions)}
    </section>
    <section class="question-bank-panel exam-authoring-summary exam-detail-panel">
      <p class="exam-authoring-panel__eyebrow">Structure</p>
      <h3>Sections and marks</h3>
      ${
        exam.sections.length === 0
          ? `<p class="exam-authoring-summary__empty">This saved draft does not include mapped sections yet.</p>`
          : `<div class="exam-authoring-summary__sections">
              ${exam.sections
                .map(
                  (section) => `
                    <article class="exam-authoring-summary__section">
                      <div>
                        <p class="exam-authoring-summary__section-order">Section ${section.sectionOrder}</p>
                        <h4>${escapeHtml(section.title)}</h4>
                      </div>
                      <p>${section.questions.length} question${
                        section.questions.length === 1 ? "" : "s"
                      } · ${getDraftExamSectionTotalMarks(section)} marks</p>
                    </article>
                  `,
                )
                .join("")}
            </div>`
      }
    </section>
    <section class="question-bank-panel exam-authoring-summary exam-detail-panel">
      <p class="exam-authoring-panel__eyebrow">Assignments</p>
      <h3>Saved student list</h3>
      ${
        exam.assignments.length === 0
          ? `<p class="exam-authoring-summary__empty">No students are assigned to this exam yet.</p>`
          : `<div class="exam-authoring-summary__sections">
              ${exam.assignments
                .map(
                  (assignment) => `
                    <article class="exam-authoring-summary__section">
                      <div>
                        <p class="exam-authoring-summary__section-order">${escapeHtml(
                          assignment.studentId,
                        )}</p>
                        <h4>${escapeHtml(assignment.studentName)}</h4>
                      </div>
                      <p>${escapeHtml(
                        `${assignment.department} · ${assignment.studentStatus}`,
                      )}</p>
                    </article>
                  `,
                )
                .join("")}
            </div>`
      }
    </section>
  </div>
`;

const renderQuestionMeta = (
  question: DraftExamSummary["sections"][number]["questions"][number],
) => `
  <div class="exam-builder-question__chips">
    ${renderQuestionBankChip(QUESTION_TYPE_LABELS[question.snapshot.type], "type")}
    ${renderQuestionBankChip(
      QUESTION_DIFFICULTY_LABELS[question.snapshot.difficulty],
      toDifficultyTone(question.snapshot.difficulty),
    )}
    ${renderQuestionBankChip(question.snapshot.topicName, "topic")}
    ${renderQuestionBankChip(
      question.snapshot.reviewMode === "MANUAL" ? "Manual Review" : "Objective",
      question.snapshot.reviewMode === "MANUAL" ? "hard" : "type",
    )}
  </div>
`;

const renderQuestionsTab = (exam: DraftExamSummary) =>
  exam.sections.length === 0
    ? `<section class="question-bank-panel exam-detail-empty">
        <h3>No mapped questions yet</h3>
        <p>This exam detail record is valid, but the saved structure does not include sectioned questions yet.</p>
      </section>`
    : `<div class="exam-detail-stack">
        ${exam.sections
          .map(
            (section) => `
              <section class="question-bank-panel exam-authoring-panel exam-detail-section">
                <div class="exam-authoring-panel__heading">
                  <div>
                    <p class="exam-authoring-panel__eyebrow">Section ${section.sectionOrder}</p>
                    <h2>${escapeHtml(section.title)}</h2>
                  </div>
                  <p class="exam-authoring-panel__helper">${section.questions.length} question${
                    section.questions.length === 1 ? "" : "s"
                  } · ${getDraftExamSectionTotalMarks(section)} marks</p>
                </div>
                <div class="exam-builder-question-list">
                  ${section.questions
                    .map(
                      (question) => `
                        <article class="exam-builder-question exam-detail-question">
                          <div class="exam-builder-question__main">
                            <div class="exam-builder-question__identity">
                              <span class="exam-builder-question__order">${question.questionOrder}</span>
                              <div>
                                <p class="exam-builder-question__eyebrow">${escapeHtml(
                                  `${question.examQuestionId} · ${question.snapshot.sourceQuestionId}`,
                                )}</p>
                                <h4>${escapeHtml(question.snapshot.stem)}</h4>
                                ${renderQuestionMeta(question)}
                              </div>
                            </div>
                            <div class="exam-detail-question__marks">
                              <p class="exam-builder-question__eyebrow">Saved Marks</p>
                              <strong>${question.marks}</strong>
                            </div>
                          </div>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              </section>
            `,
          )
          .join("")}
      </div>`;

const renderAssignmentPill = ({
  label,
  tone,
}: {
  label: string;
  tone: "eligible" | "neutral" | "blocked";
}) =>
  `<span class="exam-assignment-pill exam-assignment-pill--${tone}">${escapeHtml(
    label,
  )}</span>`;

const renderAssignmentsTab = (exam: DraftExamSummary) =>
  exam.assignments.length === 0
    ? `<section class="question-bank-panel exam-detail-empty">
        <h3>No assignments yet</h3>
        <p>This exam has not been assigned to students in the saved record.</p>
      </section>`
    : `<section class="question-bank-panel exam-authoring-panel">
        <div class="exam-authoring-panel__heading">
          <div>
            <p class="exam-authoring-panel__eyebrow">Assignments</p>
            <h2>${getDraftExamAssignedStudentCount(exam)} saved student assignment${
              getDraftExamAssignedStudentCount(exam) === 1 ? "" : "s"
            }</h2>
          </div>
          <p class="exam-authoring-panel__helper">These records define who can see and start the exam once later delivery steps are wired in.</p>
        </div>
        <div class="exam-assignment-list">
          ${exam.assignments
            .map(
              (assignment) => `
                <article class="exam-assignment-row">
                  <div class="exam-assignment-row__main">
                    <div>
                      <p class="exam-builder-question__eyebrow">${escapeHtml(
                        `${assignment.assignmentId} · ${assignment.studentId}`,
                      )}</p>
                      <h4>${escapeHtml(assignment.studentName)}</h4>
                      <div class="exam-assignment-row__meta">
                        ${renderAssignmentPill({
                          label: assignment.studentRole,
                          tone:
                            assignment.studentRole === "STUDENT"
                              ? "eligible"
                              : "blocked",
                        })}
                        ${renderAssignmentPill({
                          label: assignment.studentStatus,
                          tone:
                            assignment.studentStatus === "ACTIVE"
                              ? "eligible"
                              : "blocked",
                        })}
                        ${renderAssignmentPill({
                          label: assignment.department,
                          tone: "neutral",
                        })}
                        ${renderAssignmentPill({
                          label: assignment.studentEmail,
                          tone: "neutral",
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>`;

const renderDownstreamTab = (exam: DraftExamSummary) => {
  const mappedQuestions = getDraftExamMappedQuestionCount(exam);
  const manualQuestions = getDraftExamManualReviewQuestionCount(exam);
  const objectiveQuestions = mappedQuestions - manualQuestions;
  const assignments = getDraftExamAssignedStudentCount(exam);
  const manualResponseLoad = manualQuestions * assignments;

  const downstreamItems = [
    {
      label: "Attempt Delivery",
      title:
        exam.status === "SCHEDULED"
          ? "Ready for student access rules"
          : "Saved, but still draft-gated",
      detail:
        exam.status === "SCHEDULED"
          ? `${assignments} assigned student${
              assignments === 1 ? "" : "s"
            } can be evaluated by the future attempt runtime against this schedule.`
          : "The saved structure is complete, but students should not see the exam until it is published or scheduled.",
      tone: exam.status === "SCHEDULED" ? "is-ready" : "is-blocked",
    },
    {
      label: "Objective Scoring",
      title:
        objectiveQuestions > 0
          ? `${objectiveQuestions} auto-gradable question${
              objectiveQuestions === 1 ? "" : "s"
            }`
          : "No objective grading workload",
      detail:
        objectiveQuestions > 0
          ? "Objective question snapshots are frozen here, so later grading logic can operate without reaching back into the question bank."
          : "This authored exam currently relies fully on manual review.",
      tone: objectiveQuestions > 0 ? "is-ready" : "is-blocked",
    },
    {
      label: "Manual Review",
      title:
        manualQuestions > 0
          ? `${manualQuestions} manual question${
              manualQuestions === 1 ? "" : "s"
            } per attempt`
          : "No manual review dependency",
      detail:
        manualQuestions > 0
          ? `${manualResponseLoad} potential manual responses will reach the review queue if every assigned student submits once.`
          : "Result publication will not wait on subjective grading for this exam.",
      tone: "is-ready",
    },
    {
      label: "Result Publication",
      title:
        manualQuestions > 0
          ? "Blocked until review completes"
          : "Ready after scoring completes",
      detail:
        manualQuestions > 0
          ? "Published results for this exam should stay gated until the manual-review workload is resolved."
          : "Objective-only scoring can flow to results once downstream grading is implemented.",
      tone: manualQuestions > 0 ? "is-blocked" : "is-ready",
    },
  ] as const;

  return `
    <section class="question-bank-panel exam-authoring-summary exam-readiness">
      <div class="exam-authoring-panel__heading">
        <div>
          <p class="exam-authoring-panel__eyebrow">Downstream Readiness</p>
          <h3>Saved authoring outputs for later modules</h3>
        </div>
        ${renderExamStatusChip(exam.status)}
      </div>
      <p class="exam-authoring-summary__window">This tab translates the saved authoring structure into what the attempt, review, and result slices can consume next.</p>
      <div class="exam-readiness__list">
        ${downstreamItems
          .map(
            (item) => `
              <article class="exam-readiness__item ${item.tone}">
                <div>
                  <p class="exam-readiness__label">${escapeHtml(item.label)}</p>
                  <h4>${escapeHtml(item.title)}</h4>
                </div>
                <p>${escapeHtml(item.detail)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderActiveTabPanel = ({
  activeTab,
  exam,
}: {
  activeTab: ExamDetailTabId;
  exam: DraftExamSummary;
}) => {
  switch (activeTab) {
    case "questions":
      return renderQuestionsTab(exam);
    case "assignments":
      return renderAssignmentsTab(exam);
    case "downstream":
      return renderDownstreamTab(exam);
    case "overview":
    default:
      return renderOverviewTab(exam);
  }
};

const renderTabBar = ({
  activeTab,
}: {
  activeTab: ExamDetailTabId;
}) => `
  <div class="question-bank-panel exam-detail-tabs" role="tablist" aria-label="Exam detail tabs">
    ${EXAM_DETAIL_TABS.map(
      (tabId) => `
        <button
          class="exam-detail-tab${tabId === activeTab ? " is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${tabId === activeTab ? "true" : "false"}"
          data-tab="${tabId}"
        >
          ${escapeHtml(EXAM_DETAIL_TAB_LABELS[tabId])}
        </button>
      `,
    ).join("")}
  </div>
`;

const renderMissingExamState = ({
  demoRecords,
  requestedExamId,
}: {
  demoRecords: ExamDetailDemoRecord[];
  requestedExamId: string | null;
}) => `
  <section class="question-bank-panel exam-detail-empty">
    <p class="exam-authoring-panel__eyebrow">Exam Detail</p>
    <h2>No saved exam detail found</h2>
    <p>${
      requestedExamId
        ? escapeHtml(
            `No locally saved exam matched ${requestedExamId}. Open a demo detail record below or save an exam from the builder first.`,
          )
        : "Open a saved exam from the builder, or use one of the prepared detail scenarios below."
    }</p>
    <div class="exam-detail-demo-list">
      ${demoRecords
        .map(
          (record) => `
            <a class="exam-detail-demo-link" href="./detail.html?scenario=${encodeURIComponent(
              record.scenario,
            )}">
              <strong>${escapeHtml(record.exam.title)}</strong>
              <span>${escapeHtml(
                `${record.exam.code} · ${record.scenario}`,
              )}</span>
            </a>
          `,
        )
        .join("")}
    </div>
  </section>
`;

const renderExamDetailHero = ({
  exam,
  sourceLabel,
}: {
  exam: DraftExamSummary;
  sourceLabel: string;
}) => `
  <section class="question-bank-panel exam-detail-hero">
    <div class="exam-detail-hero__main">
      <div class="exam-detail-hero__copy">
        <div class="exam-authoring-summary__chips">
          ${renderExamStatusChip(exam.status)}
          <span class="exam-authoring-chip exam-authoring-chip--code">${escapeHtml(
            exam.code,
          )}</span>
        </div>
        <h2>${escapeHtml(exam.title)}</h2>
        <p>${escapeHtml(sourceLabel)}</p>
      </div>
      <div class="exam-detail-hero__meta">
        <p class="exam-builder-question__eyebrow">${escapeHtml(exam.examId)}</p>
        <strong>${escapeHtml(
          `${formatDraftExamDateTime(exam.windowStartsAt)} to ${formatDraftExamDateTime(
            exam.windowEndsAt,
          )}`,
        )}</strong>
      </div>
    </div>
    ${renderStatGrid(exam)}
  </section>
`;

const getExamEditHref = (examId: string) =>
  `./edit.html?examId=${encodeURIComponent(examId)}`;

export const renderExamDetailPage = ({
  activeTab,
  demoRecords,
  exam,
  requestedExamId,
  sourceLabel,
}: {
  activeTab: ExamDetailTabId;
  demoRecords: ExamDetailDemoRecord[];
  exam: DraftExamSummary | null;
  requestedExamId: string | null;
  sourceLabel: string;
}) =>
  renderExaminerWorkspaceShell({
    title: "Exam Detail",
    description:
      "Review the saved exam structure across overview, question, assignment, and downstream-readiness tabs without returning to edit mode.",
    sidebarLabel: "Saved exam detail",
    sidebarDescription:
      "This read-only surface turns the authored exam into a stable reference for later delivery, review, and result flows.",
    headerActions: `
      ${
        exam
          ? `<a class="question-bank-button question-bank-button--secondary" href="${getExamEditHref(
              exam.examId,
            )}">
              Edit exam
            </a>`
          : ""
      }
      <a class="question-bank-button question-bank-button--secondary" href="./create.html">
        Open exam builder
      </a>
      <a class="question-bank-button question-bank-button--secondary" href="../question-bank/index.html">
        Open question bank
      </a>
    `,
    mainContent: exam
      ? `
          <section class="exam-detail-layout">
            ${renderExamDetailHero({ exam, sourceLabel })}
            ${renderTabBar({ activeTab })}
            <section class="exam-detail-tabpanel" role="tabpanel">
              ${renderActiveTabPanel({ activeTab, exam })}
            </section>
          </section>
        `
      : renderMissingExamState({
          demoRecords,
          requestedExamId,
        }),
  });
