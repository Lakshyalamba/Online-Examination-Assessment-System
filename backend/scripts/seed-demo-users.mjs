import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import pg from "pg";

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: join(__dirname, "../../frontend/.env.local"), override: false });
loadEnv({ path: join(__dirname, "../../frontend/.env"), override: false });
loadEnv({ path: join(__dirname, "../.env.local"), override: false });
loadEnv({ path: join(__dirname, "../.env"), override: false });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sharedDemoPasswordHash =
  "$2b$10$vrDadlT5U74biZ9Dk.xGi.Hm/uBdRtU1mjTmoYuGhZdtonSPC2Awm";

const users = [
  {
    name: "Aarav Sharma",
    email: "admin@oeas.local",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    name: "Meera Verma",
    email: "examiner@oeas.local",
    role: "EXAMINER",
    status: "ACTIVE",
  },
  {
    name: "Rohan Gupta",
    email: "student@oeas.local",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    name: "Ananya Rao",
    email: "student2@oeas.local",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    name: "Priya Nair",
    email: "inactive.student@oeas.local",
    role: "STUDENT",
    status: "INACTIVE",
  },
];

const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  await client.connect();

  const userIdsByEmail = new Map();

  for (const user of users) {
    const result = await client.query(
      `
        insert into users (name, email, role, status, password_hash)
        values ($1, $2, $3, $4, $5)
        on conflict (email) do update
        set
          name = excluded.name,
          role = excluded.role,
          status = excluded.status,
          password_hash = excluded.password_hash
        returning id, email
      `,
      [
        user.name,
        user.email,
        user.role,
        user.status,
        sharedDemoPasswordHash,
      ],
    );
    userIdsByEmail.set(result.rows[0].email, result.rows[0].id);
  }

  const subjects = [
    ["algorithms", "Algorithms"],
    ["database-systems", "Database Systems"],
    ["operating-systems", "Operating Systems"],
  ];
  const subjectIdsBySlug = new Map();

  for (const [slug, name] of subjects) {
    const result = await client.query(
      `
        insert into subjects (slug, name)
        values ($1, $2)
        on conflict (slug) do update
        set name = excluded.name
        returning id, slug
      `,
      [slug, name],
    );
    subjectIdsBySlug.set(result.rows[0].slug, result.rows[0].id);
  }

  const adminId = userIdsByEmail.get("admin@oeas.local");
  const examinerId = userIdsByEmail.get("examiner@oeas.local");
  const studentId = userIdsByEmail.get("student@oeas.local");
  const student2Id = userIdsByEmail.get("student2@oeas.local");

  const seededQuestions = [
    {
      slug: "database-systems",
      type: "SINGLE_CHOICE",
      stem: "Which normal form removes partial dependency from a relation?",
      difficulty: "EASY",
      explanation: "Second normal form removes partial dependency from a relation already in first normal form.",
      expectedAnswer: null,
      reviewMode: "OBJECTIVE",
      createdBy: examinerId,
      options: [
        ["A", "First Normal Form", false, 1],
        ["B", "Second Normal Form", true, 2],
        ["C", "Third Normal Form", false, 3],
        ["D", "Boyce-Codd Normal Form", false, 4],
      ],
    },
    {
      slug: "algorithms",
      type: "TRUE_FALSE",
      stem: "Dijkstra's algorithm works correctly with negative edge weights.",
      difficulty: "MEDIUM",
      explanation: "Dijkstra's greedy finalization step is invalid when negative edge weights exist.",
      expectedAnswer: null,
      reviewMode: "OBJECTIVE",
      createdBy: examinerId,
      options: [
        ["A", "True", false, 1],
        ["B", "False", true, 2],
      ],
    },
    {
      slug: "operating-systems",
      type: "SHORT_TEXT",
      stem: "Explain why virtual memory helps process isolation.",
      difficulty: "MEDIUM",
      explanation: "A strong answer should mention separate address spaces and mapping from virtual to physical memory.",
      expectedAnswer: "Virtual memory gives each process an isolated address space mapped safely to physical memory.",
      reviewMode: "MANUAL",
      createdBy: adminId,
      options: [],
    },
  ];

  const questionIds = [];

  for (const question of seededQuestions) {
    const existing = await client.query(
      `select id from questions where stem = $1 limit 1`,
      [question.stem],
    );
    let questionId = existing.rows[0]?.id;

    if (!questionId) {
      const inserted = await client.query(
        `
          insert into questions (
            type, stem, difficulty, topic_id, explanation, expected_answer,
            review_mode, created_by, updated_by
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $8)
          returning id
        `,
        [
          question.type,
          question.stem,
          question.difficulty,
          subjectIdsBySlug.get(question.slug),
          question.explanation,
          question.expectedAnswer,
          question.reviewMode,
          question.createdBy,
        ],
      );
      questionId = inserted.rows[0].id;
    }

    await client.query(`delete from question_options where question_id = $1`, [
      questionId,
    ]);

    for (const option of question.options) {
      await client.query(
        `
          insert into question_options (
            question_id, label, text, is_correct, option_order
          )
          values ($1, $2, $3, $4, $5)
        `,
        [questionId, ...option],
      );
    }

    questionIds.push(questionId);
  }

  const startsAt = new Date(Date.now() - 30 * 60 * 1000);
  const endsAt = new Date(Date.now() + 90 * 60 * 1000);
  const examResult = await client.query(
    `
      insert into exams (
        title, code, instructions, duration_minutes, window_starts_at,
        window_ends_at, status, result_visibility, passing_marks,
        created_by, updated_by
      )
      values (
        'DBMS Demo Exam',
        'DBMS-DEMO',
        $1::jsonb,
        60,
        $2,
        $3,
        'SCHEDULED',
        'AFTER_SUBMISSION',
        2,
        $4,
        $4
      )
      on conflict (code) do update
      set
        title = excluded.title,
        instructions = excluded.instructions,
        duration_minutes = excluded.duration_minutes,
        window_starts_at = excluded.window_starts_at,
        window_ends_at = excluded.window_ends_at,
        status = excluded.status,
        result_visibility = excluded.result_visibility,
        passing_marks = excluded.passing_marks,
        updated_by = excluded.updated_by
      returning id
    `,
    [
      JSON.stringify([
        "Read every question carefully.",
        "Objective answers are scored automatically after submission.",
      ]),
      startsAt,
      endsAt,
      examinerId,
    ],
  );
  const examId = examResult.rows[0].id;

  await client.query(`delete from exam_sections where exam_id = $1`, [examId]);

  const sectionResult = await client.query(
    `
      insert into exam_sections (exam_id, title, section_order)
      values ($1, 'Section 1', 1)
      returning id
    `,
    [examId],
  );
  const sectionId = sectionResult.rows[0].id;

  for (const [index, questionId] of questionIds.entries()) {
    await client.query(
      `
        insert into exam_questions (
          exam_id, section_id, question_id, question_order, marks
        )
        values ($1, $2, $3, $4, $5)
      `,
      [examId, sectionId, questionId, index + 1, index === 2 ? 5 : 2],
    );
  }

  for (const assignedStudentId of [studentId, student2Id]) {
    await client.query(
      `
        insert into exam_assignments (exam_id, student_id, assigned_by, status)
        values ($1, $2, $3, 'ACTIVE')
        on conflict (exam_id, student_id) do update
        set status = 'ACTIVE', assigned_by = excluded.assigned_by
      `,
      [examId, assignedStudentId, examinerId],
    );
  }

  console.log("Seeded demo users, subjects, questions, exam, and assignments.");
  console.log("Shared demo password: OeasDemo@123");
} finally {
  await client.end();
}
