import {
  createDraftExamSummary,
  normalizeDraftExamAuthoringDraft,
  publishDraftExamAuthoringDraft,
  validateDraftExamAuthoringDraft,
} from "../create-exam/exam-authoring-form";
import { DRAFT_EXAM_AUTHORING_SCENARIOS } from "../create-exam/exam-authoring.scenarios";
import type { DraftExamSummary } from "../domain/exam.types";

export interface ExamDetailDemoRecord {
  scenario: string;
  exam: DraftExamSummary;
}

const buildDraftSummaryFromScenario = (
  scenario: keyof typeof DRAFT_EXAM_AUTHORING_SCENARIOS,
) => {
  const scenarioDraft = structuredClone(DRAFT_EXAM_AUTHORING_SCENARIOS[scenario]);
  const result = validateDraftExamAuthoringDraft(scenarioDraft);

  if (!result.success) {
    throw new Error(`Scenario ${scenario} is not valid for exam detail preview`);
  }

  const normalizedDraft = normalizeDraftExamAuthoringDraft(
    scenarioDraft,
    result.data,
  );

  return createDraftExamSummary({
    ...result.data,
    status: normalizedDraft.status,
  });
};

const buildScheduledSummaryFromScenario = (
  scenario: keyof typeof DRAFT_EXAM_AUTHORING_SCENARIOS,
) => {
  const scenarioDraft = structuredClone(DRAFT_EXAM_AUTHORING_SCENARIOS[scenario]);
  const result = publishDraftExamAuthoringDraft(scenarioDraft);

  if (!result.success) {
    throw new Error(`Scenario ${scenario} is not publish-ready for exam detail preview`);
  }

  return createDraftExamSummary(result.data);
};

export const EXAM_DETAIL_DEMO_RECORDS: ExamDetailDemoRecord[] = [
  {
    scenario: "draft-success",
    exam: buildDraftSummaryFromScenario("draft-success"),
  },
  {
    scenario: "builder-success",
    exam: buildDraftSummaryFromScenario("builder-success"),
  },
  {
    scenario: "publish-ready",
    exam: buildScheduledSummaryFromScenario("publish-ready"),
  },
];

export const findExamDetailDemoRecordByScenario = (scenario: string) =>
  EXAM_DETAIL_DEMO_RECORDS.find((record) => record.scenario === scenario) ?? null;

export const findExamDetailDemoRecordById = (examId: string) =>
  EXAM_DETAIL_DEMO_RECORDS.find((record) => record.exam.examId === examId) ??
  null;
