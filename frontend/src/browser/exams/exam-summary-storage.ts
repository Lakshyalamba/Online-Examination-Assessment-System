import type { DraftExamSummary } from "../../modules/exams/domain/exam.types";

const EXAM_SUMMARY_STORAGE_KEY = "oeas.exam-authoring.saved-summaries";

type PersistedDraftExamSummary = Omit<
  DraftExamSummary,
  "windowEndsAt" | "windowStartsAt"
> & {
  windowStartsAt: string;
  windowEndsAt: string;
};

const serializeDraftExamSummary = (
  summary: DraftExamSummary,
): PersistedDraftExamSummary => ({
  ...summary,
  windowStartsAt: summary.windowStartsAt.toISOString(),
  windowEndsAt: summary.windowEndsAt.toISOString(),
});

const deserializeDraftExamSummary = (
  summary: PersistedDraftExamSummary,
): DraftExamSummary => ({
  ...summary,
  windowStartsAt: new Date(summary.windowStartsAt),
  windowEndsAt: new Date(summary.windowEndsAt),
});

const readStoredExamSummaryMap = (): Record<string, PersistedDraftExamSummary> => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return {};
  }

  const rawValue = window.localStorage.getItem(EXAM_SUMMARY_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, PersistedDraftExamSummary>;

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStoredExamSummaryMap = (
  value: Record<string, PersistedDraftExamSummary>,
) => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return;
  }

  window.localStorage.setItem(
    EXAM_SUMMARY_STORAGE_KEY,
    JSON.stringify(value),
  );
};

export const persistDraftExamSummary = (summary: DraftExamSummary) => {
  const storedMap = readStoredExamSummaryMap();

  storedMap[summary.examId] = serializeDraftExamSummary(summary);
  writeStoredExamSummaryMap(storedMap);
};

export const readPersistedDraftExamSummary = (examId: string) => {
  const storedSummary = readStoredExamSummaryMap()[examId];

  return storedSummary ? deserializeDraftExamSummary(storedSummary) : null;
};
