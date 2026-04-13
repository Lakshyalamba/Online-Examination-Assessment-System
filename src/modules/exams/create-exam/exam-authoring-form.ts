import type { QuestionBankEntry } from "../../questions/question-bank/question-bank.types.js";
import type {
  DraftExamQuestionRecord,
  DraftExamQuestionSnapshot,
  DraftExamSectionRecord,
  DraftExamSummary,
  DraftExamValues,
} from "../domain/exam.types.js";
import {
  draftExamSchema,
  type DraftExamValidatedValues,
} from "../validation/exam.schemas.js";

export interface DraftExamQuestionAuthoringDraft {
  examQuestionId: string;
  questionOrder: number;
  marks: string;
  snapshot: DraftExamQuestionSnapshot;
}

export interface DraftExamSectionAuthoringDraft {
  sectionId: string;
  title: string;
  sectionOrder: number;
  questions: DraftExamQuestionAuthoringDraft[];
}

export interface DraftExamAuthoringDraft {
  title: string;
  code: string;
  instructionsText: string;
  durationMinutes: string;
  windowStartsAt: string;
  windowEndsAt: string;
  sections: DraftExamSectionAuthoringDraft[];
}

type DraftExamFieldKey = Exclude<keyof DraftExamAuthoringDraft, "sections">;
type DraftExamSectionFieldKey = "title" | "sectionOrder" | "questions";
type DraftExamQuestionFieldKey = "marks" | "questionOrder";

export interface DraftExamAuthoringFormErrors {
  summary: string[];
  form: string[];
  fields: Partial<Record<DraftExamFieldKey, string[]>>;
  sectionFields: Record<
    number,
    Partial<Record<DraftExamSectionFieldKey, string[]>>
  >;
  questionFields: Record<
    number,
    Record<number, Partial<Record<DraftExamQuestionFieldKey, string[]>>>
  >;
}

const DRAFT_EXAM_FIELD_KEYS = new Set<DraftExamFieldKey>([
  "title",
  "code",
  "instructionsText",
  "durationMinutes",
  "windowStartsAt",
  "windowEndsAt",
]);
const DRAFT_EXAM_SECTION_FIELD_KEYS = new Set<DraftExamSectionFieldKey>([
  "title",
  "sectionOrder",
  "questions",
]);
const DRAFT_EXAM_QUESTION_FIELD_KEYS = new Set<DraftExamQuestionFieldKey>([
  "marks",
  "questionOrder",
]);

const VALIDATION_PATH_TO_FIELD: Record<string, DraftExamFieldKey> = {
  title: "title",
  code: "code",
  instructions: "instructionsText",
  durationMinutes: "durationMinutes",
  windowStartsAt: "windowStartsAt",
  windowEndsAt: "windowEndsAt",
};

const pushUniqueMessage = (messages: string[], message: string) => {
  if (!messages.includes(message)) {
    messages.push(message);
  }
};

export const createEmptyDraftExamFormErrors =
  (): DraftExamAuthoringFormErrors => ({
    summary: [],
    form: [],
    fields: {},
    sectionFields: {},
    questionFields: {},
  });

export const createDraftExamAuthoringDraft = (
  overrides: Partial<DraftExamAuthoringDraft> = {},
): DraftExamAuthoringDraft => ({
  title: "",
  code: "",
  instructionsText: "",
  durationMinutes: "90",
  windowStartsAt: "",
  windowEndsAt: "",
  sections: [],
  ...overrides,
});

export const updateDraftExamField = (
  draft: DraftExamAuthoringDraft,
  field: DraftExamFieldKey,
  value: string,
): DraftExamAuthoringDraft => ({
  ...draft,
  [field]: value,
});

export const parseDraftExamInstructions = (instructionsText: string) =>
  instructionsText
    .split(/\r?\n/)
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction !== "");

const getNextEntityId = (ids: string[], prefix: string) => {
  const maxSuffix = ids.reduce((currentMax, id) => {
    if (!id.startsWith(`${prefix}-`)) {
      return currentMax;
    }

    const suffix = Number(id.slice(prefix.length + 1));

    if (!Number.isInteger(suffix)) {
      return currentMax;
    }

    return Math.max(currentMax, suffix);
  }, 0);

  return `${prefix}-${maxSuffix + 1}`;
};

const resequenceDraftExamQuestions = (
  questions: DraftExamQuestionAuthoringDraft[],
) =>
  questions.map((question, index) => ({
    ...question,
    questionOrder: index + 1,
  }));

const resequenceDraftExamSections = (
  sections: DraftExamSectionAuthoringDraft[],
) =>
  sections.map((section, index) => ({
    ...section,
    sectionOrder: index + 1,
    questions: resequenceDraftExamQuestions(section.questions),
  }));

const replaceDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  replaceWith: (
    section: DraftExamSectionAuthoringDraft,
  ) => DraftExamSectionAuthoringDraft,
) => ({
  ...draft,
  sections: resequenceDraftExamSections(
    draft.sections.map((section) =>
      section.sectionId === sectionId ? replaceWith(section) : section,
    ),
  ),
});

const parseMarksValue = (value: string | number) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

const getDefaultExamQuestionMarks = (entry: QuestionBankEntry) =>
  entry.reviewMode === "MANUAL" ? "10" : "2";

export const createDraftExamQuestionSnapshot = (
  entry: QuestionBankEntry,
): DraftExamQuestionSnapshot => ({
  sourceQuestionId: entry.id,
  stem: entry.stem,
  type: entry.type,
  difficulty: entry.difficulty,
  topicId: entry.topicId,
  topicName: entry.topicName,
  reviewMode: entry.reviewMode,
});

export const isQuestionMappedInDraft = (
  draft: DraftExamAuthoringDraft,
  sourceQuestionId: string,
) =>
  draft.sections.some((section) =>
    section.questions.some(
      (question) => question.snapshot.sourceQuestionId === sourceQuestionId,
    ),
  );

export const addDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  overrides: Partial<Pick<DraftExamSectionAuthoringDraft, "title">> = {},
): DraftExamAuthoringDraft => {
  const sectionId = getNextEntityId(
    draft.sections.map((section) => section.sectionId),
    "section",
  );
  const nextSectionNumber = draft.sections.length + 1;

  return {
    ...draft,
    sections: [
      ...draft.sections,
      {
        sectionId,
        title: overrides.title ?? `Section ${nextSectionNumber}`,
        sectionOrder: nextSectionNumber,
        questions: [],
      },
    ],
  };
};

export const removeDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
): DraftExamAuthoringDraft => ({
  ...draft,
  sections: resequenceDraftExamSections(
    draft.sections.filter((section) => section.sectionId !== sectionId),
  ),
});

export const moveDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  direction: "up" | "down",
): DraftExamAuthoringDraft => {
  const currentIndex = draft.sections.findIndex(
    (section) => section.sectionId === sectionId,
  );

  if (currentIndex === -1) {
    return draft;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= draft.sections.length) {
    return draft;
  }

  const nextSections = [...draft.sections];
  const [movedSection] = nextSections.splice(currentIndex, 1);

  if (!movedSection) {
    return draft;
  }

  nextSections.splice(targetIndex, 0, movedSection);

  return {
    ...draft,
    sections: resequenceDraftExamSections(nextSections),
  };
};

export const updateDraftExamSectionTitle = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  title: string,
): DraftExamAuthoringDraft =>
  replaceDraftExamSection(draft, sectionId, (section) => ({
    ...section,
    title,
  }));

export const addQuestionToDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  entry: QuestionBankEntry,
): DraftExamAuthoringDraft => {
  if (isQuestionMappedInDraft(draft, entry.id)) {
    return draft;
  }

  const examQuestionId = getNextEntityId(
    draft.sections.flatMap((section) =>
      section.questions.map((question) => question.examQuestionId),
    ),
    "eq",
  );

  return replaceDraftExamSection(draft, sectionId, (section) => ({
    ...section,
    questions: [
      ...section.questions,
      {
        examQuestionId,
        questionOrder: section.questions.length + 1,
        marks: getDefaultExamQuestionMarks(entry),
        snapshot: createDraftExamQuestionSnapshot(entry),
      },
    ],
  }));
};

export const removeQuestionFromDraftExamSection = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  examQuestionId: string,
): DraftExamAuthoringDraft =>
  replaceDraftExamSection(draft, sectionId, (section) => ({
    ...section,
    questions: resequenceDraftExamQuestions(
      section.questions.filter(
        (question) => question.examQuestionId !== examQuestionId,
      ),
    ),
  }));

export const moveDraftExamQuestion = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  examQuestionId: string,
  direction: "up" | "down",
): DraftExamAuthoringDraft =>
  replaceDraftExamSection(draft, sectionId, (section) => {
    const currentIndex = section.questions.findIndex(
      (question) => question.examQuestionId === examQuestionId,
    );

    if (currentIndex === -1) {
      return section;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= section.questions.length) {
      return section;
    }

    const nextQuestions = [...section.questions];
    const [movedQuestion] = nextQuestions.splice(currentIndex, 1);

    if (!movedQuestion) {
      return section;
    }

    nextQuestions.splice(targetIndex, 0, movedQuestion);

    return {
      ...section,
      questions: resequenceDraftExamQuestions(nextQuestions),
    };
  });

export const updateDraftExamQuestionMarks = (
  draft: DraftExamAuthoringDraft,
  sectionId: string,
  examQuestionId: string,
  marks: string,
): DraftExamAuthoringDraft =>
  replaceDraftExamSection(draft, sectionId, (section) => ({
    ...section,
    questions: section.questions.map((question) =>
      question.examQuestionId === examQuestionId
        ? {
            ...question,
            marks,
          }
        : question,
    ),
  }));

export const getDraftExamMappedQuestionCount = ({
  sections,
}: Pick<DraftExamAuthoringDraft | DraftExamValues, "sections">) =>
  sections.reduce((total, section) => total + section.questions.length, 0);

export const getDraftExamSectionTotalMarks = ({
  questions,
}: Pick<
  DraftExamSectionAuthoringDraft | DraftExamSectionRecord,
  "questions"
>) =>
  questions.reduce((total, question) => total + parseMarksValue(question.marks), 0);

export const getDraftExamTotalMarks = ({
  sections,
}: Pick<DraftExamAuthoringDraft | DraftExamValues, "sections">) =>
  sections.reduce(
    (total, section) => total + getDraftExamSectionTotalMarks(section),
    0,
  );

export const getDraftExamManualReviewQuestionCount = ({
  sections,
}: Pick<DraftExamAuthoringDraft | DraftExamValues, "sections">) =>
  sections.reduce(
    (total, section) =>
      total +
      section.questions.filter(
        (question) => question.snapshot.reviewMode === "MANUAL",
      ).length,
    0,
  );

const toDraftExamValidationInput = (draft: DraftExamAuthoringDraft) => ({
  title: draft.title,
  code: draft.code,
  instructions: parseDraftExamInstructions(draft.instructionsText),
  durationMinutes: draft.durationMinutes,
  windowStartsAt: draft.windowStartsAt,
  windowEndsAt: draft.windowEndsAt,
  sections: draft.sections.map((section) => ({
    sectionId: section.sectionId,
    title: section.title,
    sectionOrder: section.sectionOrder,
    questions: section.questions.map((question) => ({
      examQuestionId: question.examQuestionId,
      questionOrder: question.questionOrder,
      marks: question.marks,
      snapshot: question.snapshot,
    })),
  })),
  status: "DRAFT" as const,
});

export const mapDraftExamValidationErrors = (
  issues: Array<{ message: string; path: Array<PropertyKey> }>,
): DraftExamAuthoringFormErrors => {
  const errors = createEmptyDraftExamFormErrors();

  issues.forEach((issue) => {
    pushUniqueMessage(errors.summary, issue.message);

    if (issue.path.length === 0) {
      pushUniqueMessage(errors.form, issue.message);
      return;
    }

    const firstSegment = issue.path[0];

    if (
      firstSegment === "sections" &&
      typeof issue.path[1] === "number"
    ) {
      const sectionIndex = issue.path[1];
      const sectionField = issue.path[2];

      if (
        typeof sectionField === "string" &&
        DRAFT_EXAM_SECTION_FIELD_KEYS.has(
          sectionField as DraftExamSectionFieldKey,
        )
      ) {
        if (
          sectionField === "questions" &&
          typeof issue.path[3] === "number" &&
          typeof issue.path[4] === "string" &&
          DRAFT_EXAM_QUESTION_FIELD_KEYS.has(
            issue.path[4] as DraftExamQuestionFieldKey,
          )
        ) {
          const questionIndex = issue.path[3];
          const questionField = issue.path[4] as DraftExamQuestionFieldKey;
          const sectionQuestionFields = errors.questionFields[sectionIndex] ?? {};
          const questionFieldErrors = sectionQuestionFields[questionIndex] ?? {};
          const fieldMessages = questionFieldErrors[questionField] ?? [];

          pushUniqueMessage(fieldMessages, issue.message);
          questionFieldErrors[questionField] = fieldMessages;
          sectionQuestionFields[questionIndex] = questionFieldErrors;
          errors.questionFields[sectionIndex] = sectionQuestionFields;
          return;
        }

        const sectionFieldErrors = errors.sectionFields[sectionIndex] ?? {};
        const fieldMessages =
          sectionFieldErrors[sectionField as DraftExamSectionFieldKey] ?? [];

        pushUniqueMessage(fieldMessages, issue.message);
        sectionFieldErrors[sectionField as DraftExamSectionFieldKey] =
          fieldMessages;
        errors.sectionFields[sectionIndex] = sectionFieldErrors;
        return;
      }

      const sectionFieldErrors = errors.sectionFields[sectionIndex] ?? {};
      const questionMessages = sectionFieldErrors.questions ?? [];

      pushUniqueMessage(questionMessages, issue.message);
      sectionFieldErrors.questions = questionMessages;
      errors.sectionFields[sectionIndex] = sectionFieldErrors;
      return;
    }

    if (typeof firstSegment !== "string") {
      pushUniqueMessage(errors.form, issue.message);
      return;
    }

    const fieldKey = VALIDATION_PATH_TO_FIELD[firstSegment];

    if (fieldKey && DRAFT_EXAM_FIELD_KEYS.has(fieldKey)) {
      const fieldMessages = errors.fields[fieldKey] ?? [];
      pushUniqueMessage(fieldMessages, issue.message);
      errors.fields[fieldKey] = fieldMessages;
      return;
    }

    pushUniqueMessage(errors.form, issue.message);
  });

  return errors;
};

export const validateDraftExamAuthoringDraft = (
  draft: DraftExamAuthoringDraft,
):
  | { success: true; data: DraftExamValidatedValues }
  | { success: false; errors: DraftExamAuthoringFormErrors } => {
  const parsed = draftExamSchema.safeParse(toDraftExamValidationInput(draft));

  if (parsed.success) {
    return {
      success: true,
      data: parsed.data,
    };
  }

  return {
    success: false,
    errors: mapDraftExamValidationErrors(parsed.error.issues),
  };
};

export const toDraftExamId = (code: string) =>
  `draft-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export const createDraftExamSummary = (
  values: DraftExamValues,
): DraftExamSummary => ({
  examId: toDraftExamId(values.code),
  ...values,
});

export const getDraftExamWindowDurationMinutes = ({
  windowEndsAt,
  windowStartsAt,
}: Pick<DraftExamValues, "windowEndsAt" | "windowStartsAt">) =>
  Math.round(
    (windowEndsAt.getTime() - windowStartsAt.getTime()) / (60 * 1000),
  );

export const formatDraftExamDateTime = (value: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);

export const toDateTimeLocalValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const normalizeDraftExamAuthoringDraft = (
  draft: DraftExamAuthoringDraft,
  values: DraftExamValidatedValues,
): DraftExamAuthoringDraft => ({
  ...draft,
  title: values.title,
  code: values.code,
  instructionsText: values.instructions.join("\n"),
  durationMinutes: String(values.durationMinutes),
  windowStartsAt: draft.windowStartsAt || toDateTimeLocalValue(values.windowStartsAt),
  windowEndsAt: draft.windowEndsAt || toDateTimeLocalValue(values.windowEndsAt),
  sections: values.sections.map((section) => ({
    sectionId: section.sectionId,
    title: section.title,
    sectionOrder: section.sectionOrder,
    questions: section.questions.map((question) => ({
      examQuestionId: question.examQuestionId,
      questionOrder: question.questionOrder,
      marks: String(question.marks),
      snapshot: question.snapshot,
    })),
  })),
});
