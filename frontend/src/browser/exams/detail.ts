import { readPersistedDraftExamSummary } from "./exam-summary-storage";
import {
  EXAM_DETAIL_DEMO_RECORDS,
  findExamDetailDemoRecordByScenario,
} from "../../modules/exams/detail-exam/exam-detail.records";
import {
  EXAM_DETAIL_TABS,
  renderExamDetailPage,
  type ExamDetailTabId,
} from "../../modules/exams/detail-exam/ui/exam-detail-page";

const root = document.querySelector<HTMLElement>("[data-exam-detail-root]");

if (!root) {
  throw new Error("Exam detail root element is missing.");
}

const query = new URLSearchParams(window.location.search);

const isExamDetailTab = (value: string | null): value is ExamDetailTabId =>
  value !== null &&
  EXAM_DETAIL_TABS.includes(value as (typeof EXAM_DETAIL_TABS)[number]);

const getActiveTabFromQuery = (): ExamDetailTabId => {
  const requestedTab = query.get("tab");

  return isExamDetailTab(requestedTab) ? requestedTab : "overview";
};

const resolveExamDetailRecord = () => {
  const requestedExamId = query.get("examId");
  const requestedScenario = query.get("scenario");

  if (requestedExamId) {
    const storedExam = readPersistedDraftExamSummary(requestedExamId);

    if (storedExam) {
      return {
        exam: storedExam,
        requestedExamId,
        sourceLabel: "Loaded from the local authoring workspace.",
      };
    }
  }

  if (requestedScenario) {
    const demoRecord = findExamDetailDemoRecordByScenario(requestedScenario);

    if (demoRecord) {
      return {
        exam: demoRecord.exam,
        requestedExamId,
        sourceLabel: `Loaded from demo scenario ${requestedScenario}.`,
      };
    }
  }

  if (requestedExamId || requestedScenario) {
    return {
      exam: null,
      requestedExamId,
      sourceLabel: "",
    };
  }

  const fallbackRecord = findExamDetailDemoRecordByScenario("publish-ready");

  return {
    exam: fallbackRecord?.exam ?? null,
    requestedExamId: null,
    sourceLabel: fallbackRecord
      ? "Loaded from demo scenario publish-ready."
      : "",
  };
};

const state: {
  activeTab: ExamDetailTabId;
} = {
  activeTab: getActiveTabFromQuery(),
};

const render = () => {
  const detailRecord = resolveExamDetailRecord();

  root.innerHTML = renderExamDetailPage({
    activeTab: state.activeTab,
    demoRecords: EXAM_DETAIL_DEMO_RECORDS,
    exam: detailRecord.exam,
    requestedExamId: detailRecord.requestedExamId,
    sourceLabel: detailRecord.sourceLabel,
  });
};

const syncUrl = () => {
  const nextUrl = new URL(window.location.href);

  nextUrl.searchParams.set("tab", state.activeTab);
  window.history.replaceState({}, "", nextUrl);
};

root.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const tabTrigger = target.closest<HTMLElement>("[data-tab]");
  const requestedTab = tabTrigger?.dataset.tab ?? null;

  if (!isExamDetailTab(requestedTab) || requestedTab === state.activeTab) {
    return;
  }

  state.activeTab = requestedTab;
  syncUrl();
  render();
});

render();
