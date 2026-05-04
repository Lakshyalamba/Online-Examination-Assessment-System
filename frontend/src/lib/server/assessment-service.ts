import { auth } from "@oeas/backend/auth";
import { getDb } from "@oeas/backend/lib/db";
import type { AppRole } from "@oeas/backend/modules/auth/types";
import type { PoolClient, QueryResultRow } from "pg";

import {
  questionAuthoringSchema,
  type QuestionAuthoringInput,
  type QuestionAuthoringValues,
} from "@/modules/questions/validation/question.schemas";
import type {
  QuestionAuthoringDraft,
  QuestionOptionDraft,
  QuestionReviewMode,
  QuestionType,
} from "@/modules/questions/domain/question.types";
import {
  draftExamSchema,
  type DraftExamInput,
  type DraftExamValidatedValues,
} from "@/modules/exams/validation/exam.schemas";

type AuthenticatedUser = {
  id: string;
  role: AppRole;
  name?: string | null;
  email?: string | null;
};

type DbClient = Pick<PoolClient, "query">;

type QuestionOptionRecord = {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  optionOrder: number;
};

type AttemptAnswerAggregate = {
  selectedOptionId: string | null;
  answerText: string | null;
};

type QuestionRow = QueryResultRow & {
  id: string;
  type: QuestionType;
  stem: string;
  difficulty: QuestionAuthoringValues["difficulty"];
  topicId: string;
  topicName: string;
  explanation: string;
  expectedAnswer: string | null;
  reviewMode: QuestionReviewMode;
  createdBy: string;
  updatedAt: Date;
  usageCount: number;
  options: QuestionOptionRecord[] | null;
};

export type PersistedQuestion = {
  id: string;
  stem: string;
  type: QuestionType;
  difficulty: QuestionAuthoringValues["difficulty"];
  topicId: string;
  topicName: string;
  reviewMode: QuestionReviewMode;
  usageCount: number;
  updatedAt: string;
  answerPreview: string[];
  explanation: string;
  draft: QuestionAuthoringDraft;
  createdBy: string;
};

export type StudentAssignmentCandidate = {
  userId: string;
  name: string;
  email: string;
  department: string;
  role: "STUDENT";
  status: "ACTIVE";
};

export type PersistedExamListItem = {
  id: string;
  title: string;
  code: string;
  status: string;
  durationMinutes: number;
  windowStartsAt: string;
  windowEndsAt: string;
  resultVisibility: string;
  totalMarks: number;
  questionCount: number;
  assignmentCount: number;
  createdBy: string;
};

export type StudentAssignedExam = PersistedExamListItem & {
  assignmentId: string;
  topicName: string;
  attemptId: string | null;
  attemptStatus: string | null;
  submittedAt: string | null;
  availabilityStatus: "upcoming" | "available" | "attempted" | "expired";
};

export type AttemptQuestion = {
  examQuestionId: string;
  questionId: string;
  questionOrder: number;
  type: QuestionType;
  stem: string;
  marks: number;
  selectedOptionIds: string[];
  answerText: string;
  options: Array<{ id: string; label: string; text: string }>;
};

export type AttemptPayload = {
  attemptId: string;
  examId: string;
  title: string;
  code: string;
  instructions: string[];
  startedAt: string;
  expiresAt: string;
  status: string;
  questions: AttemptQuestion[];
};

export type StudentResult = {
  attemptId: string;
  examId: string;
  title: string;
  code: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  attemptedCount: number;
  unattemptedCount: number;
  passed: boolean | null;
  submittedAt: string | null;
};

export class AssessmentError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function canWriteAssessments(user: Pick<AuthenticatedUser, "role">) {
  return user.role === "ADMIN" || user.role === "EXAMINER";
}

export function canManageAssessmentRecord(
  user: Pick<AuthenticatedUser, "id" | "role">,
  createdBy: string,
) {
  return user.role === "ADMIN" || (user.role === "EXAMINER" && user.id === createdBy);
}

const objectiveTypes: readonly QuestionType[] = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
];

const isObjectiveType = (type: QuestionType) => objectiveTypes.includes(type);

const getReviewMode = (type: QuestionType): QuestionReviewMode =>
  isObjectiveType(type) ? "OBJECTIVE" : "MANUAL";

const toIso = (value: Date | string | null | undefined) =>
  value instanceof Date ? value.toISOString() : value ?? null;

const numberValue = (value: unknown) =>
  typeof value === "number" ? value : Number(value ?? 0);

export async function requireApiUser(roles?: AppRole[]) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !user.role) {
    throw new AssessmentError(401, "You must be signed in to continue.");
  }

  if (roles && !roles.includes(user.role)) {
    throw new AssessmentError(403, "Your role is not allowed to perform this action.");
  }

  return user as AuthenticatedUser;
}

function assertOwnerOrAdmin(user: AuthenticatedUser, createdBy: string) {
  if (!canManageAssessmentRecord(user, createdBy)) {
    throw new AssessmentError(403, "You can only manage records you created.");
  }
}

async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getDb().connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function ensureSubject(
  client: DbClient,
  slug: string,
  fallbackName?: string,
) {
  const normalizedSlug = slug.trim().toLowerCase();
  const name =
    fallbackName?.trim() ||
    normalizedSlug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const result = await client.query<{ id: string; slug: string; name: string }>(
    `
      insert into subjects (slug, name)
      values ($1, $2)
      on conflict (slug) do update
      set name = excluded.name
      returning id, slug, name
    `,
    [normalizedSlug, name],
  );

  return result.rows[0]!;
}

function rowToQuestion(row: QuestionRow): PersistedQuestion {
  const options = [...(row.options ?? [])].sort(
    (left, right) => left.optionOrder - right.optionOrder,
  );
  const draft =
    isObjectiveType(row.type)
      ? {
          type: row.type,
          stem: row.stem,
          difficulty: row.difficulty,
          topicId: row.topicId,
          explanation: row.explanation,
          options: options.map<QuestionOptionDraft>((option) => ({
            id: option.id,
            label: option.label,
            text: option.text,
            isCorrect: option.isCorrect,
            optionOrder: option.optionOrder,
          })),
        }
      : {
          type: row.type,
          stem: row.stem,
          difficulty: row.difficulty,
          topicId: row.topicId,
          explanation: row.explanation,
          expectedAnswer: row.expectedAnswer ?? "",
        };

  const answerPreview = isObjectiveType(row.type)
    ? options.filter((option) => option.isCorrect).map((option) => option.text)
    : [row.expectedAnswer ?? ""].filter(Boolean);

  return {
    id: row.id,
    stem: row.stem,
    type: row.type,
    difficulty: row.difficulty,
    topicId: row.topicId,
    topicName: row.topicName,
    reviewMode: row.reviewMode,
    usageCount: Number(row.usageCount),
    updatedAt: row.updatedAt.toISOString(),
    answerPreview,
    explanation: row.explanation,
    draft: draft as QuestionAuthoringDraft,
    createdBy: row.createdBy,
  };
}

async function readQuestionRows(user: AuthenticatedUser, questionId?: string) {
  const params: unknown[] = [];
  const where: string[] = [];

  if (user.role === "EXAMINER") {
    params.push(user.id);
    where.push(`q.created_by = $${params.length}`);
  }

  if (questionId) {
    params.push(questionId);
    where.push(`q.id = $${params.length}`);
  }

  const result = await getDb().query<QuestionRow>(
    `
      select
        q.id,
        q.type,
        q.stem,
        q.difficulty,
        s.slug as "topicId",
        s.name as "topicName",
        q.explanation,
        q.expected_answer as "expectedAnswer",
        q.review_mode as "reviewMode",
        q.created_by as "createdBy",
        q.updated_at as "updatedAt",
        count(distinct eq.id)::int as "usageCount",
        coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id', qo.id,
              'label', qo.label,
              'text', qo.text,
              'isCorrect', qo.is_correct,
              'optionOrder', qo.option_order
            )
            order by qo.option_order
          ) filter (where qo.id is not null),
          '[]'::jsonb
        ) as options
      from questions q
      join subjects s on s.id = q.topic_id
      left join question_options qo on qo.question_id = q.id
      left join exam_questions eq on eq.question_id = q.id
      ${where.length > 0 ? `where ${where.join(" and ")}` : ""}
      group by q.id, s.slug, s.name
      order by q.updated_at desc
    `,
    params,
  );

  return result.rows.map(rowToQuestion);
}

export async function listQuestionsForUser(user: AuthenticatedUser) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot read the question bank.");
  }

  return readQuestionRows(user);
}

export async function createQuestion(
  user: AuthenticatedUser,
  input: QuestionAuthoringInput,
) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot create questions.");
  }

  const values = questionAuthoringSchema.parse(input);

  return withTransaction(async (client) => {
    const subject = await ensureSubject(client, values.topicId);
    const reviewMode = getReviewMode(values.type);
    const expectedAnswer = isObjectiveType(values.type)
      ? null
      : "expectedAnswer" in values
        ? values.expectedAnswer
        : null;

    const question = await client.query<{ id: string }>(
      `
        insert into questions (
          type, stem, difficulty, topic_id, explanation, expected_answer,
          review_mode, created_by, updated_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $8)
        returning id
      `,
      [
        values.type,
        values.stem,
        values.difficulty,
        subject.id,
        values.explanation ?? "",
        expectedAnswer,
        reviewMode,
        user.id,
      ],
    );

    if ("options" in values) {
      for (const option of values.options) {
        await client.query(
          `
            insert into question_options (
              question_id, label, text, is_correct, option_order
            )
            values ($1, $2, $3, $4, $5)
          `,
          [
            question.rows[0]!.id,
            option.label,
            option.text,
            option.isCorrect,
            option.optionOrder,
          ],
        );
      }
    }

    return question.rows[0]!.id;
  });
}

export async function updateQuestion(
  user: AuthenticatedUser,
  questionId: string,
  input: QuestionAuthoringInput,
) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot update questions.");
  }

  const existing = await getDb().query<{ createdBy: string }>(
    `select created_by as "createdBy" from questions where id = $1`,
    [questionId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Question not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);
  const values = questionAuthoringSchema.parse(input);

  await withTransaction(async (client) => {
    const subject = await ensureSubject(client, values.topicId);
    const expectedAnswer = isObjectiveType(values.type)
      ? null
      : "expectedAnswer" in values
        ? values.expectedAnswer
        : null;

    await client.query(
      `
        update questions
        set
          type = $2,
          stem = $3,
          difficulty = $4,
          topic_id = $5,
          explanation = $6,
          expected_answer = $7,
          review_mode = $8,
          updated_by = $9
        where id = $1
      `,
      [
        questionId,
        values.type,
        values.stem,
        values.difficulty,
        subject.id,
        values.explanation ?? "",
        expectedAnswer,
        getReviewMode(values.type),
        user.id,
      ],
    );

    await client.query(`delete from question_options where question_id = $1`, [
      questionId,
    ]);

    if ("options" in values) {
      for (const option of values.options) {
        await client.query(
          `
            insert into question_options (
              question_id, label, text, is_correct, option_order
            )
            values ($1, $2, $3, $4, $5)
          `,
          [questionId, option.label, option.text, option.isCorrect, option.optionOrder],
        );
      }
    }
  });
}

export async function deleteQuestion(user: AuthenticatedUser, questionId: string) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot delete questions.");
  }

  const existing = await getDb().query<{ createdBy: string; usageCount: number }>(
    `
      select
        q.created_by as "createdBy",
        count(eq.id)::int as "usageCount"
      from questions q
      left join exam_questions eq on eq.question_id = q.id
      where q.id = $1
      group by q.id
    `,
    [questionId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Question not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);

  if (Number(existing.rows[0].usageCount) > 0) {
    throw new AssessmentError(409, "Questions already mapped to exams cannot be deleted.");
  }

  await getDb().query(`delete from questions where id = $1`, [questionId]);
}

export async function listStudentsForAssignment() {
  const result = await getDb().query<QueryResultRow & StudentAssignmentCandidate>(
    `
      select
        id as "userId",
        name,
        email,
        'General' as department,
        role,
        status
      from users
      where role = 'STUDENT' and status = 'ACTIVE'
      order by name
    `,
  );

  return result.rows;
}

function mapExamRow(row: QueryResultRow): PersistedExamListItem {
  return {
    id: String(row.id),
    title: String(row.title),
    code: String(row.code),
    status: String(row.status),
    durationMinutes: Number(row.durationMinutes),
    windowStartsAt: toIso(row.windowStartsAt) ?? "",
    windowEndsAt: toIso(row.windowEndsAt) ?? "",
    resultVisibility: String(row.resultVisibility),
    totalMarks: Number(row.totalMarks ?? 0),
    questionCount: Number(row.questionCount ?? 0),
    assignmentCount: Number(row.assignmentCount ?? 0),
    createdBy: String(row.createdBy),
  };
}

export async function listExamsForUser(user: AuthenticatedUser) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot manage exams.");
  }

  const params: unknown[] = [];
  const where: string[] = [];

  if (user.role === "EXAMINER") {
    params.push(user.id);
    where.push(`e.created_by = $${params.length}`);
  }

  const result = await getDb().query(
    `
      select
        e.id,
        e.title,
        e.code,
        e.status,
        e.duration_minutes as "durationMinutes",
        e.window_starts_at as "windowStartsAt",
        e.window_ends_at as "windowEndsAt",
        e.result_visibility as "resultVisibility",
        e.created_by as "createdBy",
        coalesce(sum(eq.marks), 0)::int as "totalMarks",
        count(distinct eq.id)::int as "questionCount",
        count(distinct ea.id)::int as "assignmentCount"
      from exams e
      left join exam_questions eq on eq.exam_id = e.id
      left join exam_assignments ea on ea.exam_id = e.id and ea.status = 'ACTIVE'
      ${where.length > 0 ? `where ${where.join(" and ")}` : ""}
      group by e.id
      order by e.updated_at desc
    `,
    params,
  );

  return result.rows.map(mapExamRow);
}

async function replaceExamChildren(
  client: PoolClient,
  examId: string,
  values: DraftExamValidatedValues,
  userId: string,
) {
  await client.query(`delete from exam_assignments where exam_id = $1`, [examId]);
  await client.query(`delete from exam_sections where exam_id = $1`, [examId]);

  for (const section of values.sections) {
    const sectionResult = await client.query<{ id: string }>(
      `
        insert into exam_sections (exam_id, title, section_order)
        values ($1, $2, $3)
        returning id
      `,
      [examId, section.title, section.sectionOrder],
    );
    const sectionId = sectionResult.rows[0]!.id;

    for (const question of section.questions) {
      await client.query(
        `
          insert into exam_questions (
            exam_id, section_id, question_id, question_order, marks
          )
          values ($1, $2, $3, $4, $5)
        `,
        [
          examId,
          sectionId,
          question.snapshot.sourceQuestionId,
          question.questionOrder,
          question.marks,
        ],
      );
    }
  }

  for (const assignment of values.assignments) {
    await client.query(
      `
        insert into exam_assignments (exam_id, student_id, assigned_by, status)
        values ($1, $2, $3, 'ACTIVE')
        on conflict (exam_id, student_id) do update
        set status = 'ACTIVE', assigned_by = excluded.assigned_by
      `,
      [examId, assignment.studentId, userId],
    );
  }
}

export async function createExam(user: AuthenticatedUser, input: DraftExamInput) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot create exams.");
  }

  const values = draftExamSchema.parse(input);

  return withTransaction(async (client) => {
    const examResult = await client.query<{ id: string }>(
      `
        insert into exams (
          title, code, instructions, duration_minutes, window_starts_at,
          window_ends_at, status, created_by, updated_by
        )
        values ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $8)
        returning id
      `,
      [
        values.title,
        values.code,
        JSON.stringify(values.instructions),
        values.durationMinutes,
        values.windowStartsAt,
        values.windowEndsAt,
        values.status,
        user.id,
      ],
    );

    await replaceExamChildren(client, examResult.rows[0]!.id, values, user.id);
    return examResult.rows[0]!.id;
  });
}

export async function updateExam(
  user: AuthenticatedUser,
  examId: string,
  input: DraftExamInput,
) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot update exams.");
  }

  const existing = await getDb().query<{ createdBy: string }>(
    `select created_by as "createdBy" from exams where id = $1`,
    [examId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Exam not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);
  const values = draftExamSchema.parse(input);

  await withTransaction(async (client) => {
    await client.query(
      `
        update exams
        set
          title = $2,
          code = $3,
          instructions = $4::jsonb,
          duration_minutes = $5,
          window_starts_at = $6,
          window_ends_at = $7,
          status = $8,
          updated_by = $9
        where id = $1
      `,
      [
        examId,
        values.title,
        values.code,
        JSON.stringify(values.instructions),
        values.durationMinutes,
        values.windowStartsAt,
        values.windowEndsAt,
        values.status,
        user.id,
      ],
    );

    await replaceExamChildren(client, examId, values, user.id);
  });
}

export async function deleteExam(user: AuthenticatedUser, examId: string) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot delete exams.");
  }

  const existing = await getDb().query<{ createdBy: string }>(
    `select created_by as "createdBy" from exams where id = $1`,
    [examId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Exam not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);
  await getDb().query(`delete from exams where id = $1`, [examId]);
}

export async function updateExamStatus(
  user: AuthenticatedUser,
  examId: string,
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "CLOSED" | "ARCHIVED",
) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot update exams.");
  }

  const existing = await getDb().query<{ createdBy: string }>(
    `select created_by as "createdBy" from exams where id = $1`,
    [examId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Exam not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);

  await getDb().query(
    `update exams set status = $2, updated_by = $3 where id = $1`,
    [examId, status, user.id],
  );
}

export async function assignExamToStudents(
  user: AuthenticatedUser,
  examId: string,
  studentIds: string[],
) {
  if (user.role === "STUDENT") {
    throw new AssessmentError(403, "Students cannot assign exams.");
  }

  const existing = await getDb().query<{ createdBy: string }>(
    `select created_by as "createdBy" from exams where id = $1`,
    [examId],
  );

  if (!existing.rows[0]) {
    throw new AssessmentError(404, "Exam not found.");
  }

  assertOwnerOrAdmin(user, existing.rows[0].createdBy);

  await withTransaction(async (client) => {
    for (const studentId of studentIds) {
      await client.query(
        `
          insert into exam_assignments (exam_id, student_id, assigned_by, status)
          select $1, id, $3, 'ACTIVE'
          from users
          where id = $2 and role = 'STUDENT' and status = 'ACTIVE'
          on conflict (exam_id, student_id) do update
          set status = 'ACTIVE', assigned_by = excluded.assigned_by
        `,
        [examId, studentId, user.id],
      );
    }
  });
}

export async function listAssignedExamsForStudent(user: AuthenticatedUser) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can read assigned exams here.");
  }

  const result = await getDb().query(
    `
      select
        e.id,
        e.title,
        e.code,
        e.status,
        e.duration_minutes as "durationMinutes",
        e.window_starts_at as "windowStartsAt",
        e.window_ends_at as "windowEndsAt",
        e.result_visibility as "resultVisibility",
        e.created_by as "createdBy",
        ea.id as "assignmentId",
        coalesce(min(s.name), 'General') as "topicName",
        coalesce(sum(eq.marks), 0)::int as "totalMarks",
        count(distinct eq.id)::int as "questionCount",
        1 as "assignmentCount",
        latest_attempt.id as "attemptId",
        latest_attempt.status as "attemptStatus",
        latest_attempt.submitted_at as "submittedAt"
      from exam_assignments ea
      join exams e on e.id = ea.exam_id
      left join exam_sections es on es.exam_id = e.id
      left join exam_questions eq on eq.section_id = es.id
      left join questions q on q.id = eq.question_id
      left join subjects s on s.id = q.topic_id
      left join lateral (
        select id, status, submitted_at
        from exam_attempts
        where exam_id = e.id and student_id = ea.student_id
        order by created_at desc
        limit 1
      ) latest_attempt on true
      where ea.student_id = $1 and ea.status = 'ACTIVE'
      group by e.id, ea.id, latest_attempt.id, latest_attempt.status, latest_attempt.submitted_at
      order by e.window_starts_at
    `,
    [user.id],
  );

  const now = Date.now();

  return result.rows.map<StudentAssignedExam>((row) => {
    const base = mapExamRow(row);
    const starts = new Date(base.windowStartsAt).getTime();
    const ends = new Date(base.windowEndsAt).getTime();
    const attempted = row.attemptStatus && row.attemptStatus !== "in_progress";
    const availabilityStatus: StudentAssignedExam["availabilityStatus"] =
      attempted
        ? "attempted"
        : now < starts
          ? "upcoming"
          : now > ends
            ? "expired"
            : "available";

    return {
      ...base,
      assignmentId: String(row.assignmentId),
      topicName: String(row.topicName),
      attemptId: row.attemptId ? String(row.attemptId) : null,
      attemptStatus: row.attemptStatus ? String(row.attemptStatus) : null,
      submittedAt: toIso(row.submittedAt),
      availabilityStatus,
    };
  });
}

async function getAssignedExamForStudent(userId: string, examId: string) {
  const result = await getDb().query(
    `
      select
        ea.id as "assignmentId",
        e.*,
        coalesce(sum(eq.marks), 0)::int as "totalMarks",
        count(distinct eq.id)::int as "questionCount",
        latest_attempt.id as "attemptId",
        latest_attempt.status as "attemptStatus"
      from exam_assignments ea
      join exams e on e.id = ea.exam_id
      left join exam_questions eq on eq.exam_id = e.id
      left join lateral (
        select id, status
        from exam_attempts
        where exam_id = e.id and student_id = ea.student_id
        order by created_at desc
        limit 1
      ) latest_attempt on true
      where ea.student_id = $1 and ea.exam_id = $2 and ea.status = 'ACTIVE'
      group by ea.id, e.id, latest_attempt.id, latest_attempt.status
    `,
    [userId, examId],
  );

  return result.rows[0] ?? null;
}

export async function getExamForAttempt(user: AuthenticatedUser, examId: string) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can read this exam start view.");
  }

  const row = await getAssignedExamForStudent(user.id, examId);

  if (!row) {
    throw new AssessmentError(404, "This exam is not assigned to you.");
  }

  const now = Date.now();
  const startsAt = new Date(row.window_starts_at).getTime();
  const endsAt = new Date(row.window_ends_at).getTime();
  const attemptStatus = row.attemptStatus ? String(row.attemptStatus) : null;
  const alreadyAttempted = attemptStatus !== null && attemptStatus !== "in_progress";
  const availabilityStatus = alreadyAttempted
    ? "attempted"
    : now < startsAt
      ? "upcoming"
      : now > endsAt
        ? "expired"
        : "available";

  return {
    id: String(row.id),
    title: String(row.title),
    code: String(row.code),
    durationMinutes: Number(row.duration_minutes),
    windowStartsAt: toIso(row.window_starts_at) ?? "",
    windowEndsAt: toIso(row.window_ends_at) ?? "",
    status: String(row.status),
    totalMarks: Number(row.totalMarks),
    questionCount: Number(row.questionCount),
    attemptId: row.attemptId ? String(row.attemptId) : null,
    attemptStatus,
    availabilityStatus,
  };
}

export async function startExamAttempt(user: AuthenticatedUser, examId: string) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can start exam attempts.");
  }

  const row = await getAssignedExamForStudent(user.id, examId);

  if (!row) {
    throw new AssessmentError(404, "This exam is not assigned to you.");
  }

  if (row.attemptId && row.attemptStatus === "in_progress") {
    return String(row.attemptId);
  }

  if (row.attemptId && !row.allow_retakes) {
    throw new AssessmentError(409, "This exam has already been attempted.");
  }

  const now = new Date();
  const startsAt = new Date(row.window_starts_at);
  const endsAt = new Date(row.window_ends_at);

  if (now < startsAt) {
    throw new AssessmentError(403, "This exam has not opened yet.");
  }

  if (now > endsAt) {
    throw new AssessmentError(403, "This exam window has expired.");
  }

  const expiresAt = new Date(
    Math.min(
      endsAt.getTime(),
      now.getTime() + Number(row.duration_minutes) * 60 * 1000,
    ),
  );

  const result = await getDb().query<{ id: string }>(
    `
      insert into exam_attempts (
        exam_id, assignment_id, student_id, status, started_at, expires_at, total_marks
      )
      values ($1, $2, $3, 'in_progress', $4, $5, $6)
      returning id
    `,
    [examId, row.assignmentId, user.id, now, expiresAt, Number(row.totalMarks)],
  );

  return result.rows[0]!.id;
}

export async function getAttemptPayload(user: AuthenticatedUser, attemptId: string) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can open this attempt.");
  }

  const attempt = await getDb().query(
    `
      select
        a.id,
        a.exam_id as "examId",
        a.status,
        a.started_at as "startedAt",
        a.expires_at as "expiresAt",
        e.title,
        e.code,
        e.instructions
      from exam_attempts a
      join exams e on e.id = a.exam_id
      where a.id = $1 and a.student_id = $2
      limit 1
    `,
    [attemptId, user.id],
  );

  const attemptRow = attempt.rows[0];

  if (!attemptRow) {
    throw new AssessmentError(404, "Attempt not found.");
  }

  if (attemptRow.status !== "in_progress") {
    throw new AssessmentError(409, "This attempt is already submitted.");
  }

  const questions = await getDb().query(
    `
      select
        eq.id as "examQuestionId",
        q.id as "questionId",
        eq.question_order as "questionOrder",
        q.type,
        q.stem,
        eq.marks,
        coalesce(
          jsonb_agg(
            jsonb_build_object('id', qo.id, 'label', qo.label, 'text', qo.text)
            order by qo.option_order
          ) filter (where qo.id is not null),
          '[]'::jsonb
        ) as options,
        coalesce(
          jsonb_agg(distinct jsonb_build_object(
            'selectedOptionId', aa.selected_option_id,
            'answerText', aa.answer_text
          )) filter (where aa.id is not null),
          '[]'::jsonb
        ) as answers
      from exam_questions eq
      join questions q on q.id = eq.question_id
      left join question_options qo on qo.question_id = q.id
      left join exam_attempt_answers aa
        on aa.attempt_id = $1 and aa.exam_question_id = eq.id
      where eq.exam_id = $2
      group by eq.id, q.id
      order by eq.question_order
    `,
    [attemptId, attemptRow.examId],
  );

  return {
    attemptId: String(attemptRow.id),
    examId: String(attemptRow.examId),
    title: String(attemptRow.title),
    code: String(attemptRow.code),
    instructions: Array.isArray(attemptRow.instructions)
      ? attemptRow.instructions
      : [],
    startedAt: toIso(attemptRow.startedAt) ?? "",
    expiresAt: toIso(attemptRow.expiresAt) ?? "",
    status: String(attemptRow.status),
    questions: questions.rows.map<AttemptQuestion>((row) => {
      const answers: AttemptAnswerAggregate[] = Array.isArray(row.answers)
        ? row.answers
        : [];
      return {
        examQuestionId: String(row.examQuestionId),
        questionId: String(row.questionId),
        questionOrder: Number(row.questionOrder),
        type: row.type as QuestionType,
        stem: String(row.stem),
        marks: Number(row.marks),
        selectedOptionIds: answers
          .map((answer) => answer.selectedOptionId)
          .filter((optionId): optionId is string => Boolean(optionId)),
        answerText:
          answers.find((answer) => typeof answer.answerText === "string")
            ?.answerText ?? "",
        options: Array.isArray(row.options) ? row.options : [],
      };
    }),
  } satisfies AttemptPayload;
}

export async function saveAttemptAnswer(
  user: AuthenticatedUser,
  attemptId: string,
  examQuestionId: string,
  answer: { selectedOptionIds?: string[]; answerText?: string },
) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can save answers.");
  }

  const attempt = await getDb().query<{ id: string; status: string; expiresAt: Date }>(
    `
      select id, status, expires_at as "expiresAt"
      from exam_attempts
      where id = $1 and student_id = $2
    `,
    [attemptId, user.id],
  );

  if (!attempt.rows[0]) {
    throw new AssessmentError(404, "Attempt not found.");
  }

  if (attempt.rows[0].status !== "in_progress") {
    throw new AssessmentError(409, "This attempt is already closed.");
  }

  if (new Date() > attempt.rows[0].expiresAt) {
    await autoSubmitExpiredAttempt(user, attemptId);
    throw new AssessmentError(409, "The timer ended and the attempt was auto-submitted.");
  }

  await withTransaction(async (client) => {
    await client.query(
      `delete from exam_attempt_answers where attempt_id = $1 and exam_question_id = $2`,
      [attemptId, examQuestionId],
    );

    const selectedOptionIds = answer.selectedOptionIds ?? [];

    if (selectedOptionIds.length > 0) {
      for (const optionId of selectedOptionIds) {
        await client.query(
          `
            insert into exam_attempt_answers (
              attempt_id, exam_question_id, selected_option_id
            )
            values ($1, $2, $3)
          `,
          [attemptId, examQuestionId, optionId],
        );
      }
      return;
    }

    const text = answer.answerText?.trim();

    if (text) {
      await client.query(
        `
          insert into exam_attempt_answers (
            attempt_id, exam_question_id, answer_text
          )
          values ($1, $2, $3)
        `,
        [attemptId, examQuestionId, text],
      );
    }
  });
}

async function gradeAttempt(client: DbClient, attemptId: string) {
  const rows = await client.query(
    `
      select
        eq.id as "examQuestionId",
        eq.marks,
        q.type,
        array_remove(array_agg(distinct qo.id) filter (where qo.is_correct), null) as "correctOptionIds",
        array_remove(array_agg(distinct aa.selected_option_id), null) as "selectedOptionIds",
        bool_or(aa.answer_text is not null and btrim(aa.answer_text) <> '') as "hasTextAnswer"
      from exam_questions eq
      join exam_attempts a on a.exam_id = eq.exam_id
      join questions q on q.id = eq.question_id
      left join question_options qo on qo.question_id = q.id
      left join exam_attempt_answers aa
        on aa.attempt_id = a.id and aa.exam_question_id = eq.id
      where a.id = $1
      group by eq.id, q.id
      order by eq.question_order
    `,
    [attemptId],
  );

  let score = 0;
  let totalMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let attemptedCount = 0;

  for (const row of rows.rows) {
    const marks = numberValue(row.marks);
    totalMarks += marks;
    const selected = ((row.selectedOptionIds ?? []) as unknown[]).map(String).sort();
    const correct = ((row.correctOptionIds ?? []) as unknown[]).map(String).sort();
    const hasTextAnswer = Boolean(row.hasTextAnswer);
    const attempted = selected.length > 0 || hasTextAnswer;
    let questionScore = 0;
    let isCorrect: boolean | null = null;

    if (attempted) {
      attemptedCount += 1;
    }

    if (isObjectiveType(row.type as QuestionType) && attempted) {
      isCorrect =
        selected.length === correct.length &&
        selected.every((optionId, index) => optionId === correct[index]);

      if (isCorrect) {
        correctCount += 1;
        questionScore = marks;
        score += marks;
      } else {
        incorrectCount += 1;
      }

      await client.query(
        `
          update exam_attempt_answers
          set is_correct = $3, marks_awarded = $4
          where attempt_id = $1 and exam_question_id = $2
        `,
        [attemptId, row.examQuestionId, isCorrect, questionScore],
      );
    }
  }

  const questionCount = rows.rows.length;
  const unattemptedCount = questionCount - attemptedCount;
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  return {
    score,
    totalMarks,
    percentage,
    correctCount,
    incorrectCount,
    attemptedCount,
    unattemptedCount,
  };
}

async function closeAttempt(
  user: AuthenticatedUser,
  attemptId: string,
  status: "submitted" | "auto_submitted" | "expired",
) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can submit attempts.");
  }

  await withTransaction(async (client) => {
    const attempt = await client.query<{ id: string }>(
      `
        select id
        from exam_attempts
        where id = $1 and student_id = $2 and status = 'in_progress'
        for update
      `,
      [attemptId, user.id],
    );

    if (!attempt.rows[0]) {
      throw new AssessmentError(404, "Active attempt not found.");
    }

    const grade = await gradeAttempt(client, attemptId);

    await client.query(
      `
        update exam_attempts
        set
          status = $2,
          submitted_at = now(),
          score = $3,
          total_marks = $4,
          percentage = $5,
          correct_count = $6,
          incorrect_count = $7,
          attempted_count = $8,
          unattempted_count = $9
        where id = $1
      `,
      [
        attemptId,
        status,
        grade.score,
        grade.totalMarks,
        grade.percentage,
        grade.correctCount,
        grade.incorrectCount,
        grade.attemptedCount,
        grade.unattemptedCount,
      ],
    );
  });
}

export async function submitExamAttempt(user: AuthenticatedUser, attemptId: string) {
  await closeAttempt(user, attemptId, "submitted");
}

export async function autoSubmitExpiredAttempt(
  user: AuthenticatedUser,
  attemptId: string,
) {
  await closeAttempt(user, attemptId, "auto_submitted");
}

export async function getStudentResult(user: AuthenticatedUser, attemptId: string) {
  const params: unknown[] = [attemptId];
  const where = [`a.id = $1`];

  if (user.role === "STUDENT") {
    params.push(user.id);
    where.push(`a.student_id = $${params.length}`);
  } else if (user.role === "EXAMINER") {
    params.push(user.id);
    where.push(`e.created_by = $${params.length}`);
  }

  const result = await getDb().query(
    `
      select
        a.id as "attemptId",
        e.id as "examId",
        e.title,
        e.code,
        e.passing_marks as "passingMarks",
        e.result_visibility as "resultVisibility",
        e.window_ends_at as "windowEndsAt",
        a.status,
        a.score,
        a.total_marks as "totalMarks",
        a.percentage,
        a.correct_count as "correctCount",
        a.incorrect_count as "incorrectCount",
        a.attempted_count as "attemptedCount",
        a.unattempted_count as "unattemptedCount",
        a.submitted_at as "submittedAt"
      from exam_attempts a
      join exams e on e.id = a.exam_id
      where ${where.join(" and ")}
      limit 1
    `,
    params,
  );

  const row = result.rows[0];

  if (!row) {
    throw new AssessmentError(404, "Result not found.");
  }

  if (user.role === "STUDENT") {
    if (row.status === "in_progress") {
      throw new AssessmentError(409, "Result is not available before submission.");
    }

    if (row.resultVisibility === "HIDDEN") {
      throw new AssessmentError(403, "Results are hidden for this exam.");
    }

    if (
      row.resultVisibility === "AFTER_WINDOW_END" &&
      new Date() < new Date(row.windowEndsAt)
    ) {
      throw new AssessmentError(403, "Results will be visible after the exam window ends.");
    }
  }

  const passingMarks =
    row.passingMarks === null || row.passingMarks === undefined
      ? null
      : Number(row.passingMarks);

  return {
    attemptId: String(row.attemptId),
    examId: String(row.examId),
    title: String(row.title),
    code: String(row.code),
    score: Number(row.score),
    totalMarks: Number(row.totalMarks),
    percentage: Number(row.percentage),
    correctCount: Number(row.correctCount),
    incorrectCount: Number(row.incorrectCount),
    attemptedCount: Number(row.attemptedCount),
    unattemptedCount: Number(row.unattemptedCount),
    passed: passingMarks === null ? null : Number(row.score) >= passingMarks,
    submittedAt: toIso(row.submittedAt),
  } satisfies StudentResult;
}

export async function listStudentResults(user: AuthenticatedUser) {
  if (user.role !== "STUDENT") {
    throw new AssessmentError(403, "Only students can list their results here.");
  }

  const result = await getDb().query<{ attemptId: string }>(
    `
      select a.id as "attemptId"
      from exam_attempts a
      join exams e on e.id = a.exam_id
      where a.student_id = $1
        and a.status in ('submitted', 'auto_submitted', 'expired')
        and (
          e.result_visibility = 'AFTER_SUBMISSION'
          or (e.result_visibility = 'AFTER_WINDOW_END' and now() >= e.window_ends_at)
        )
      order by a.submitted_at desc nulls last
    `,
    [user.id],
  );

  return Promise.all(result.rows.map((row) => getStudentResult(user, row.attemptId)));
}
