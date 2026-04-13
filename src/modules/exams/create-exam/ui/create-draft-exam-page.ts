import {
  escapeHtml,
  renderQuestionBankChip,
} from "../../../questions/question-bank/ui/question-bank-ui.shared.js";
import type { QuestionBankEntry } from "../../../questions/question-bank/question-bank.types.js";
import {
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
} from "../../../questions/utils/question-authoring.js";
import type { DraftExamSummary } from "../../domain/exam.types.js";
import type {
  DraftExamAuthoringDraft,
  DraftExamAuthoringFormErrors,
  DraftExamSectionAuthoringDraft,
} from "../exam-authoring-form.js";
import {
  formatDraftExamDateTime,
  getDraftExamManualReviewQuestionCount,
  getDraftExamMappedQuestionCount,
  getDraftExamSectionTotalMarks,
  getDraftExamTotalMarks,
  getDraftExamWindowDurationMinutes,
  isQuestionMappedInDraft,
  parseDraftExamInstructions,
} from "../exam-authoring-form.js";

const renderErrorMessages = (messages?: string[]) => {
  if (!messages || messages.length === 0) {
    return "";
  }

  return `<ul class="exam-authoring-errors">${messages
    .map((message) => `<li>${escapeHtml(message)}</li>`)
    .join("")}</ul>`;
};

const toDifficultyTone = (difficulty: QuestionBankEntry["difficulty"]) =>
  difficulty.toLowerCase() as "easy" | "medium" | "hard";

const renderExamAuthoringShell = ({
  description,
  headerActions = "",
  mainContent,
  title,
}: {
  description: string;
  headerActions?: string;
  mainContent: string;
  title: string;
}) => `
  <div class="question-bank-shell">
    <aside class="question-bank-shell__sidebar" aria-label="Examiner navigation">
      <div class="question-bank-brand">
        <span class="question-bank-brand__mark">OE</span>
        <div>
          <p>Online Examination</p>
          <p>Assessment System</p>
        </div>
      </div>
      <nav class="question-bank-nav">
        <a href="#" class="question-bank-nav__item">Dashboard</a>
        <a href="./create.html" class="question-bank-nav__item is-active" aria-current="page">Exams</a>
        <a href="../question-bank/index.html" class="question-bank-nav__item">Question Bank</a>
        <a href="#" class="question-bank-nav__item">Review Queue</a>
        <a href="#" class="question-bank-nav__item">Analytics</a>
      </nav>
      <div class="question-bank-sidebar__footer">
        <p>Exam draft workspace</p>
        <p>Metadata, sections, and question mapping stay aligned here before assignments or publication.</p>
      </div>
    </aside>
    <main class="question-bank-shell__main">
      <header class="question-bank-page-header">
        <div class="question-bank-page-header__top">
          <div class="question-bank-page-header__copy">
            <p class="question-bank-page-header__eyebrow">Examiner Authoring</p>
            <h1>${escapeHtml(title)}</h1>
            <p>${escapeHtml(description)}</p>
          </div>
          ${
            headerActions === ""
              ? ""
              : `<div class="question-bank-page-header__actions">${headerActions}</div>`
          }
        </div>
      </header>
      ${mainContent}
    </main>
  </div>
`;

const formatDraftInputDateTime = (value: string) => {
  if (value.trim() === "") {
    return "Not scheduled";
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? "Invalid date"
    : formatDraftExamDateTime(parsed);
};

const getDraftWindowMinutes = (draft: DraftExamAuthoringDraft) => {
  if (draft.windowStartsAt.trim() === "" || draft.windowEndsAt.trim() === "") {
    return null;
  }

  const start = new Date(draft.windowStartsAt);
  const end = new Date(draft.windowEndsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.round((end.getTime() - start.getTime()) / (60 * 1000));
};

const getDraftWindowLengthLabel = (draftWindowMinutes: number | null) => {
  if (draftWindowMinutes === null) {
    return "Set both schedule fields";
  }

  if (draftWindowMinutes < 0) {
    return "Window closes before it opens";
  }

  return `${draftWindowMinutes} minutes`;
};

const renderStatusBanner = ({
  errors,
  status,
}: {
  errors: DraftExamAuthoringFormErrors;
  status:
    | { tone: "success"; title: string; detail: string }
    | { tone: "error"; title: string; detail: string }
    | null;
}) => {
  if (!status) {
    return "";
  }

  return `
    <section class="question-bank-panel exam-authoring-status exam-authoring-status--${status.tone}" role="status" aria-live="polite">
      <div>
        <h2>${escapeHtml(status.title)}</h2>
        <p>${escapeHtml(status.detail)}</p>
      </div>
      ${
        status.tone === "error"
          ? `<ul>${errors.summary
              .map((message) => `<li>${escapeHtml(message)}</li>`)
              .join("")}</ul>`
          : ""
      }
    </section>
  `;
};

const renderMetadataPanel = ({
  draft,
  errors,
}: {
  draft: DraftExamAuthoringDraft;
  errors: DraftExamAuthoringFormErrors;
}) => `
  <section id="section-builder" class="question-bank-panel exam-authoring-panel">
    <div class="exam-authoring-panel__heading">
      <div>
        <p class="exam-authoring-panel__eyebrow">Metadata</p>
        <h2>Set the draft identity</h2>
      </div>
      <p class="exam-authoring-panel__helper">Title, code, and duration establish the draft exam contract used by later authoring steps.</p>
    </div>
    <div class="exam-authoring-fields">
      <label class="question-bank-field exam-authoring-fields__wide">
        <span class="question-bank-field__label">Exam title</span>
        <input
          class="question-bank-field__control"
          type="text"
          value="${escapeHtml(draft.title)}"
          placeholder="e.g. Database Systems Midterm"
          data-focus-id="title"
          data-field="title"
        />
        ${renderErrorMessages(errors.fields.title)}
      </label>
      <label class="question-bank-field">
        <span class="question-bank-field__label">Exam code</span>
        <input
          class="question-bank-field__control exam-authoring-field--mono"
          type="text"
          value="${escapeHtml(draft.code)}"
          placeholder="e.g. DBMS-301"
          data-focus-id="code"
          data-field="code"
        />
        ${renderErrorMessages(errors.fields.code)}
      </label>
      <label class="question-bank-field">
        <span class="question-bank-field__label">Duration</span>
        <div class="exam-authoring-field-with-suffix">
          <input
            class="question-bank-field__control"
            type="number"
            min="1"
            step="1"
            value="${escapeHtml(draft.durationMinutes)}"
            placeholder="90"
            data-focus-id="durationMinutes"
            data-field="durationMinutes"
          />
          <span>minutes</span>
        </div>
        ${renderErrorMessages(errors.fields.durationMinutes)}
      </label>
    </div>
  </section>
`;

const renderSchedulePanel = ({
  draft,
  errors,
}: {
  draft: DraftExamAuthoringDraft;
  errors: DraftExamAuthoringFormErrors;
}) => {
  const draftWindowMinutes = getDraftWindowMinutes(draft);

  return `
    <section class="question-bank-panel exam-authoring-panel">
      <div class="exam-authoring-panel__heading">
        <div>
          <p class="exam-authoring-panel__eyebrow">Schedule</p>
          <h2>Define the exam window</h2>
        </div>
        <p class="exam-authoring-panel__helper">The scheduled window must open before it closes, and the exam duration must fit inside that range.</p>
      </div>
      <div class="exam-authoring-fields">
        <label class="question-bank-field">
          <span class="question-bank-field__label">Window opens</span>
          <input
            class="question-bank-field__control"
            type="datetime-local"
            value="${escapeHtml(draft.windowStartsAt)}"
            data-focus-id="windowStartsAt"
            data-field="windowStartsAt"
          />
          ${renderErrorMessages(errors.fields.windowStartsAt)}
        </label>
        <label class="question-bank-field">
          <span class="question-bank-field__label">Window closes</span>
          <input
            class="question-bank-field__control"
            type="datetime-local"
            value="${escapeHtml(draft.windowEndsAt)}"
            data-focus-id="windowEndsAt"
            data-field="windowEndsAt"
          />
          ${renderErrorMessages(errors.fields.windowEndsAt)}
        </label>
      </div>
      <div class="exam-authoring-panel__note">
        <p>Current window length</p>
        <strong>${getDraftWindowLengthLabel(draftWindowMinutes)}</strong>
      </div>
    </section>
  `;
};

const renderInstructionsPanel = ({
  draft,
  errors,
}: {
  draft: DraftExamAuthoringDraft;
  errors: DraftExamAuthoringFormErrors;
}) => `
  <section class="question-bank-panel exam-authoring-panel">
    <div class="exam-authoring-panel__heading">
      <div>
        <p class="exam-authoring-panel__eyebrow">Instructions</p>
        <h2>Write the student-facing guidance</h2>
      </div>
      <p class="exam-authoring-panel__helper">Use one clear instruction per line so the saved draft can carry stable attempt guidance later.</p>
    </div>
    <label class="question-bank-field">
      <span class="question-bank-field__label">Exam instructions</span>
      <textarea
        class="question-bank-field__control exam-authoring-textarea"
        rows="8"
        placeholder="Read every question carefully before answering."
        data-focus-id="instructionsText"
        data-field="instructionsText"
      >${escapeHtml(draft.instructionsText)}</textarea>
      ${renderErrorMessages(errors.fields.instructionsText)}
    </label>
  </section>
`;

const renderQuestionSnapshotMeta = ({
  difficulty,
  topicName,
  type,
}: Pick<QuestionBankEntry, "difficulty" | "topicName" | "type">) => `
  <div class="exam-builder-question__chips">
    ${renderQuestionBankChip(QUESTION_TYPE_LABELS[type], "type")}
    ${renderQuestionBankChip(
      QUESTION_DIFFICULTY_LABELS[difficulty],
      toDifficultyTone(difficulty),
    )}
    ${renderQuestionBankChip(topicName, "topic")}
  </div>
`;

const renderSectionQuestionRows = ({
  draft,
  section,
  sectionIndex,
  errors,
}: {
  draft: DraftExamAuthoringDraft;
  section: DraftExamSectionAuthoringDraft;
  sectionIndex: number;
  errors: DraftExamAuthoringFormErrors;
}) => `
  <div class="exam-builder-question-list">
    ${section.questions
      .map((question, questionIndex) => {
        const questionErrors =
          errors.questionFields[sectionIndex]?.[questionIndex] ?? {};

        return `
          <article class="exam-builder-question">
            <div class="exam-builder-question__main">
              <div class="exam-builder-question__identity">
                <span class="exam-builder-question__order">${question.questionOrder}</span>
                <div>
                  <p class="exam-builder-question__eyebrow">${escapeHtml(
                    `${question.examQuestionId} · ${question.snapshot.sourceQuestionId}`,
                  )}</p>
                  <h4>${escapeHtml(question.snapshot.stem)}</h4>
                  ${renderQuestionSnapshotMeta({
                    difficulty: question.snapshot.difficulty,
                    topicName: question.snapshot.topicName,
                    type: question.snapshot.type,
                  })}
                </div>
              </div>
              <div class="exam-builder-question__controls">
                <label class="question-bank-field exam-builder-question__marks">
                  <span class="question-bank-field__label">Marks</span>
                  <input
                    class="question-bank-field__control"
                    type="number"
                    min="1"
                    step="1"
                    value="${escapeHtml(question.marks)}"
                    data-focus-id="${section.sectionId}-${question.examQuestionId}-marks"
                    data-section-id="${escapeHtml(section.sectionId)}"
                    data-exam-question-id="${escapeHtml(question.examQuestionId)}"
                    data-question-field="marks"
                  />
                  ${renderErrorMessages(questionErrors.marks)}
                </label>
                <div class="exam-builder-question__buttons">
                  <button
                    class="question-bank-button question-bank-button--secondary"
                    type="button"
                    data-action="move-question-up"
                    data-section-id="${escapeHtml(section.sectionId)}"
                    data-exam-question-id="${escapeHtml(question.examQuestionId)}"
                    ${questionIndex === 0 ? 'disabled="disabled"' : ""}
                  >
                    Up
                  </button>
                  <button
                    class="question-bank-button question-bank-button--secondary"
                    type="button"
                    data-action="move-question-down"
                    data-section-id="${escapeHtml(section.sectionId)}"
                    data-exam-question-id="${escapeHtml(question.examQuestionId)}"
                    ${
                      questionIndex === section.questions.length - 1
                        ? 'disabled="disabled"'
                        : ""
                    }
                  >
                    Down
                  </button>
                  <button
                    class="question-bank-button question-bank-button--secondary"
                    type="button"
                    data-action="remove-question"
                    data-section-id="${escapeHtml(section.sectionId)}"
                    data-exam-question-id="${escapeHtml(question.examQuestionId)}"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join("")}
  </div>
`;

const renderSectionBuilderPanel = ({
  activeSectionId,
  draft,
  errors,
}: {
  activeSectionId: string | null;
  draft: DraftExamAuthoringDraft;
  errors: DraftExamAuthoringFormErrors;
}) => `
  <section class="question-bank-panel exam-authoring-panel">
    <div class="exam-authoring-panel__heading">
      <div>
        <p class="exam-authoring-panel__eyebrow">Section Builder</p>
        <h2>Group questions into ordered sections</h2>
      </div>
      <div class="exam-builder-panel__actions">
        <p class="exam-authoring-panel__helper">Each section keeps its own ordered question list and marks grouping for the final exam structure.</p>
        <button
          class="question-bank-button"
          type="button"
          data-action="add-section"
        >
          Add section
        </button>
      </div>
    </div>
    ${
      draft.sections.length === 0
        ? `<div class="exam-builder-empty">
            <h3>No sections yet</h3>
            <p>Add the first section, then map question-bank items into it.</p>
          </div>`
        : `<div class="exam-builder-section-list">
            ${draft.sections
              .map((section, sectionIndex) => {
                const sectionErrors = errors.sectionFields[sectionIndex] ?? {};
                const isActive = section.sectionId === activeSectionId;

                return `
                  <article class="exam-builder-section${
                    isActive ? " is-active" : ""
                  }">
                    <div class="exam-builder-section__header">
                      <div class="exam-builder-section__identity">
                        <span class="exam-builder-section__badge">Section ${section.sectionOrder}</span>
                        <div>
                          <p>${section.questions.length} question${
                            section.questions.length === 1 ? "" : "s"
                          } · ${getDraftExamSectionTotalMarks(section)} marks</p>
                        </div>
                      </div>
                      <div class="exam-builder-section__buttons">
                        <button
                          class="question-bank-button${
                            isActive ? " question-bank-button--secondary" : ""
                          }"
                          type="button"
                          data-action="activate-section"
                          data-section-id="${escapeHtml(section.sectionId)}"
                        >
                          ${isActive ? "Mapping selected" : "Map questions"}
                        </button>
                        <button
                          class="question-bank-button question-bank-button--secondary"
                          type="button"
                          data-action="move-section-up"
                          data-section-id="${escapeHtml(section.sectionId)}"
                          ${sectionIndex === 0 ? 'disabled="disabled"' : ""}
                        >
                          Up
                        </button>
                        <button
                          class="question-bank-button question-bank-button--secondary"
                          type="button"
                          data-action="move-section-down"
                          data-section-id="${escapeHtml(section.sectionId)}"
                          ${
                            sectionIndex === draft.sections.length - 1
                              ? 'disabled="disabled"'
                              : ""
                          }
                        >
                          Down
                        </button>
                        <button
                          class="question-bank-button question-bank-button--secondary"
                          type="button"
                          data-action="remove-section"
                          data-section-id="${escapeHtml(section.sectionId)}"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <label class="question-bank-field">
                      <span class="question-bank-field__label">Section title</span>
                      <input
                        class="question-bank-field__control"
                        type="text"
                        value="${escapeHtml(section.title)}"
                        placeholder="e.g. Objective Core"
                        data-focus-id="${section.sectionId}-title"
                        data-section-id="${escapeHtml(section.sectionId)}"
                        data-section-field="title"
                      />
                      ${renderErrorMessages(sectionErrors.title)}
                    </label>
                    ${renderErrorMessages(sectionErrors.questions)}
                    ${
                      section.questions.length === 0
                        ? `<div class="exam-builder-section__empty">
                            <p>No questions mapped yet. Select this section, then add items from the question bank rail.</p>
                          </div>`
                        : renderSectionQuestionRows({
                            draft,
                            section,
                            sectionIndex,
                            errors,
                          })
                    }
                  </article>
                `;
              })
              .join("")}
          </div>`
    }
  </section>
`;

const getMappedQuestionLocation = (
  draft: DraftExamAuthoringDraft,
  sourceQuestionId: string,
) =>
  draft.sections.find((section) =>
    section.questions.some(
      (question) => question.snapshot.sourceQuestionId === sourceQuestionId,
    ),
  )?.title ?? null;

const renderQuestionMappingPanel = ({
  activeSectionId,
  draft,
  questionBankEntries,
}: {
  activeSectionId: string | null;
  draft: DraftExamAuthoringDraft;
  questionBankEntries: QuestionBankEntry[];
}) => {
  const activeSection =
    draft.sections.find((section) => section.sectionId === activeSectionId) ??
    null;

  return `
    <section id="question-mapping" class="question-bank-panel exam-authoring-summary exam-builder-bank">
      <div class="exam-authoring-panel__heading">
        <div>
          <p class="exam-authoring-panel__eyebrow">Question Mapping</p>
          <h3>Add reusable questions</h3>
        </div>
        <p class="exam-authoring-panel__helper">${
          activeSection
            ? `Currently mapping into ${activeSection.title}.`
            : "Choose or add a section before mapping questions."
        }</p>
      </div>
      <div class="exam-builder-bank__list">
        ${questionBankEntries
          .map((entry) => {
            const isMapped = isQuestionMappedInDraft(draft, entry.id);
            const mappedLocation = getMappedQuestionLocation(draft, entry.id);

            return `
              <article class="exam-builder-bank__item${
                isMapped ? " is-mapped" : ""
              }">
                <p class="exam-builder-bank__eyebrow">${escapeHtml(
                  `${entry.id} · ${entry.reviewMode === "MANUAL" ? "Manual review" : "Objective"}`,
                )}</p>
                <h4>${escapeHtml(entry.stem)}</h4>
                ${renderQuestionSnapshotMeta(entry)}
                <p class="exam-builder-bank__detail">${
                  isMapped && mappedLocation
                    ? `Mapped to ${escapeHtml(mappedLocation)}`
                    : `Ready to map into ${escapeHtml(activeSection?.title ?? "a section")}`
                }</p>
                <button
                  class="question-bank-button${isMapped ? " question-bank-button--secondary" : ""}"
                  type="button"
                  data-action="map-question"
                  data-question-id="${escapeHtml(entry.id)}"
                  ${
                    isMapped || !activeSection ? 'disabled="disabled"' : ""
                  }
                >
                  ${
                    isMapped
                      ? "Already mapped"
                      : activeSection
                        ? `Add to ${escapeHtml(activeSection.title)}`
                        : "Select a section"
                  }
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
};

const renderSectionSummaryList = ({
  emptyCopy,
  sections,
}: {
  emptyCopy: string;
  sections: Array<
    Pick<DraftExamSectionAuthoringDraft, "questions" | "sectionOrder" | "title"> |
      Pick<DraftExamSummary["sections"][number], "questions" | "sectionOrder" | "title">
  >;
}) =>
  sections.length === 0
    ? `<p class="exam-authoring-summary__empty">${escapeHtml(emptyCopy)}</p>`
    : `<div class="exam-authoring-summary__sections">
        ${sections
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
      </div>`;

const renderLiveSummary = ({
  draft,
}: {
  draft: DraftExamAuthoringDraft;
}) => {
  const instructions = parseDraftExamInstructions(draft.instructionsText);
  const draftWindowMinutes = getDraftWindowMinutes(draft);

  return `
    <section class="question-bank-panel exam-authoring-summary">
      <p class="exam-authoring-panel__eyebrow">Live Summary</p>
      <div class="exam-authoring-summary__chips">
        <span class="exam-authoring-chip exam-authoring-chip--status">Draft</span>
        <span class="exam-authoring-chip exam-authoring-chip--code">${
          escapeHtml(draft.code || "Exam code")
        }</span>
      </div>
      <dl class="exam-authoring-summary__stats">
        <div>
          <dt>Sections</dt>
          <dd>${draft.sections.length}</dd>
        </div>
        <div>
          <dt>Mapped questions</dt>
          <dd>${getDraftExamMappedQuestionCount(draft)}</dd>
        </div>
        <div>
          <dt>Total marks</dt>
          <dd>${getDraftExamTotalMarks(draft)}</dd>
        </div>
        <div>
          <dt>Manual review</dt>
          <dd>${getDraftExamManualReviewQuestionCount(draft)}</dd>
        </div>
      </dl>
      <section class="exam-authoring-summary__preview">
        <h3>${escapeHtml(draft.title || "Draft exam title preview")}</h3>
        <p class="exam-authoring-summary__window">
          ${
            draftWindowMinutes === null
              ? "Complete the schedule fields to preview the active window length."
              : draftWindowMinutes < 0
                ? "The current schedule closes before it opens."
                : `Window length: ${draftWindowMinutes} minutes`
          }
        </p>
        ${
          instructions.length === 0
            ? `<p class="exam-authoring-summary__empty">Instructions will appear here once the draft includes at least one line.</p>`
            : `<ol class="exam-authoring-summary__instructions">
                ${instructions
                  .map(
                    (instruction) =>
                      `<li>${escapeHtml(instruction)}</li>`,
                  )
                  .join("")}
              </ol>`
        }
        ${renderSectionSummaryList({
          emptyCopy:
            "Add sections and map reusable questions to see the builder summary here.",
          sections: draft.sections,
        })}
      </section>
    </section>
  `;
};

const renderLastSavedDraftPanel = ({
  lastSavedExam,
}: {
  lastSavedExam: DraftExamSummary | null;
}) => `
  <section class="question-bank-panel exam-authoring-summary">
    <p class="exam-authoring-panel__eyebrow">${
      lastSavedExam ? "Last Saved Draft" : "Validation Rules"
    }</p>
    ${
      lastSavedExam
        ? `
            <h3>${escapeHtml(lastSavedExam.title)}</h3>
            <p class="exam-authoring-summary__saved-code">${escapeHtml(
              lastSavedExam.code,
            )} · ${escapeHtml(lastSavedExam.examId)}</p>
            <dl class="exam-authoring-summary__stats">
              <div>
                <dt>Status</dt>
                <dd>${lastSavedExam.status}</dd>
              </div>
              <div>
                <dt>Window length</dt>
                <dd>${getDraftExamWindowDurationMinutes(lastSavedExam)} minutes</dd>
              </div>
              <div>
                <dt>Questions</dt>
                <dd>${getDraftExamMappedQuestionCount(lastSavedExam)}</dd>
              </div>
              <div>
                <dt>Total marks</dt>
                <dd>${getDraftExamTotalMarks(lastSavedExam)}</dd>
              </div>
            </dl>
            <p class="exam-authoring-summary__window">${escapeHtml(
              `${formatDraftExamDateTime(lastSavedExam.windowStartsAt)} to ${formatDraftExamDateTime(
                lastSavedExam.windowEndsAt,
              )}`,
            )}</p>
            ${renderSectionSummaryList({
              emptyCopy: "No sections saved in this draft yet.",
              sections: lastSavedExam.sections,
            })}
          `
        : `<ul class="exam-authoring-summary__rules">
            <li>Metadata and schedule still validate before sections are checked.</li>
            <li>Each section needs a title and at least one mapped question before the full draft can be saved.</li>
            <li>Question marks must stay positive, and a source question can only appear once in the draft.</li>
          </ul>`
    }
  </section>
`;

const renderActionPanel = () => `
  <section class="question-bank-panel exam-authoring-actions">
    <div>
      <h2>Ready to save this draft?</h2>
      <p>Saving now persists the metadata foundation plus ordered sections and mapped question snapshots. Later steps can extend assignments and publication on top of this structure.</p>
    </div>
    <div class="exam-authoring-actions__buttons">
      <button
        class="question-bank-button question-bank-button--secondary"
        type="button"
        data-action="reset-draft"
      >
        Reset draft
      </button>
      <button
        class="question-bank-button"
        type="button"
        data-action="submit-draft"
      >
        Save draft exam
      </button>
    </div>
  </section>
`;

export const renderCreateDraftExamPage = ({
  activeSectionId,
  draft,
  errors,
  lastSavedExam,
  questionBankEntries,
  status,
}: {
  activeSectionId: string | null;
  draft: DraftExamAuthoringDraft;
  errors: DraftExamAuthoringFormErrors;
  lastSavedExam: DraftExamSummary | null;
  questionBankEntries: QuestionBankEntry[];
  status:
    | { tone: "success"; title: string; detail: string }
    | { tone: "error"; title: string; detail: string }
    | null;
}) =>
  renderExamAuthoringShell({
    title: "Create Draft Exam",
    description:
      "Capture the exam metadata, organize sections, and map reusable question snapshots into a draft structure that stays ready for later authoring steps.",
    headerActions: `
      <a class="question-bank-button question-bank-button--secondary" href="../question-bank/index.html">
        Open question bank
      </a>
    `,
    mainContent: `
      ${renderStatusBanner({ errors, status })}
      <section class="exam-authoring-layout">
        <div class="exam-authoring-main">
          ${renderMetadataPanel({ draft, errors })}
          ${renderSchedulePanel({ draft, errors })}
          ${renderInstructionsPanel({ draft, errors })}
          ${renderSectionBuilderPanel({ activeSectionId, draft, errors })}
          ${renderActionPanel()}
        </div>
        <aside class="exam-authoring-sidebar">
          ${renderQuestionMappingPanel({
            activeSectionId,
            draft,
            questionBankEntries,
          })}
          ${renderLiveSummary({ draft })}
          ${renderLastSavedDraftPanel({ lastSavedExam })}
        </aside>
      </section>
    `,
  });
