export const RESULT_STATUSES = ["PENDING_REVIEW", "READY", "PUBLISHED"] as const;

export type ResultStatus = (typeof RESULT_STATUSES)[number];

export const ATTEMPT_REVIEW_COMPLETION_STATUS = "EVALUATED" as const;

const RESULT_STATUS_TRANSITIONS: Record<ResultStatus, readonly ResultStatus[]> = {
  PENDING_REVIEW: ["READY"],
  READY: ["PUBLISHED"],
  PUBLISHED: [],
};

export const getNextResultStatuses = (
  currentStatus: ResultStatus,
): readonly ResultStatus[] => RESULT_STATUS_TRANSITIONS[currentStatus];

export const canTransitionResultStatus = (
  currentStatus: ResultStatus,
  nextStatus: ResultStatus,
): boolean => RESULT_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);

export const transitionResultStatus = (
  currentStatus: ResultStatus,
  nextStatus: ResultStatus,
): ResultStatus => {
  if (!canTransitionResultStatus(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid result status transition from ${currentStatus} to ${nextStatus}.`,
    );
  }

  return nextStatus;
};

export const resolveResultStatusAfterObjectiveGrading = (
  hasSubjectiveAnswers: boolean,
): ResultStatus => (hasSubjectiveAnswers ? "PENDING_REVIEW" : "READY");

export const canPublishResult = (status: ResultStatus): boolean => status === "READY";

export const isStudentVisibleResultStatus = (
  status: ResultStatus,
): boolean => status === "PUBLISHED";
