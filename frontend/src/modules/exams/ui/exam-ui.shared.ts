import { escapeHtml } from "../../questions/question-bank/ui/question-bank-ui.shared";

export const getExamStatusToneClass = (status: string) =>
  status === "SCHEDULED"
    ? "exam-authoring-chip--scheduled"
    : "exam-authoring-chip--draft";

export const renderExamStatusChip = (status: string) =>
  `<span class="exam-authoring-chip ${getExamStatusToneClass(status)}">${escapeHtml(
    status,
  )}</span>`;

export const renderExaminerWorkspaceShell = ({
  description,
  headerActions = "",
  mainContent,
  sidebarDescription,
  sidebarLabel,
  title,
}: {
  description: string;
  headerActions?: string;
  mainContent: string;
  sidebarDescription: string;
  sidebarLabel: string;
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
        <p>${escapeHtml(sidebarLabel)}</p>
        <p>${escapeHtml(sidebarDescription)}</p>
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
