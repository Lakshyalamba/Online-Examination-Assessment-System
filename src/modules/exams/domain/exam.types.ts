import type {
  QuestionDifficulty,
  QuestionReviewMode,
  QuestionType,
} from "../../questions/domain/question.types.js";

export const EXAM_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "CLOSED",
  "ARCHIVED",
] as const;

export type ExamStatus = (typeof EXAM_STATUSES)[number];

export interface DraftExamQuestionSnapshot {
  sourceQuestionId: string;
  stem: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  topicId: string;
  topicName: string;
  reviewMode: QuestionReviewMode;
}

export interface DraftExamQuestionRecord {
  examQuestionId: string;
  questionOrder: number;
  marks: number;
  snapshot: DraftExamQuestionSnapshot;
}

export interface DraftExamSectionRecord {
  sectionId: string;
  title: string;
  sectionOrder: number;
  questions: DraftExamQuestionRecord[];
}

export interface DraftExamValues {
  title: string;
  code: string;
  instructions: string[];
  durationMinutes: number;
  windowStartsAt: Date;
  windowEndsAt: Date;
  sections: DraftExamSectionRecord[];
  status: "DRAFT";
}

export interface DraftExamSummary extends DraftExamValues {
  examId: string;
}
