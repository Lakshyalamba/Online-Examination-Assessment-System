create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('ADMIN', 'EXAMINER', 'STUDENT')),
  status text not null check (status in ('ACTIVE', 'INACTIVE')),
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_lower_idx on users (lower(email));

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on users;

create trigger users_set_updated_at
before update on users
for each row
execute function set_updated_at();

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_TEXT', 'LONG_TEXT')),
  stem text not null,
  difficulty text not null check (difficulty in ('EASY', 'MEDIUM', 'HARD')),
  topic_id uuid not null references subjects(id),
  explanation text not null default '',
  expected_answer text,
  review_mode text not null check (review_mode in ('OBJECTIVE', 'MANUAL')),
  created_by uuid not null references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_created_by_idx on questions(created_by);
create index if not exists questions_topic_id_idx on questions(topic_id);
create index if not exists questions_type_idx on questions(type);

create table if not exists question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  label text not null,
  text text not null,
  is_correct boolean not null default false,
  option_order integer not null check (option_order > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(question_id, label),
  unique(question_id, option_order)
);

create index if not exists question_options_question_id_idx on question_options(question_id);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  code text not null unique,
  instructions jsonb not null default '[]'::jsonb,
  duration_minutes integer not null check (duration_minutes > 0),
  window_starts_at timestamptz not null,
  window_ends_at timestamptz not null,
  status text not null check (status in ('DRAFT', 'SCHEDULED', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
  result_visibility text not null default 'AFTER_SUBMISSION' check (result_visibility in ('HIDDEN', 'AFTER_SUBMISSION', 'AFTER_WINDOW_END')),
  allow_retakes boolean not null default false,
  passing_marks integer check (passing_marks is null or passing_marks >= 0),
  created_by uuid not null references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (window_ends_at > window_starts_at)
);

create index if not exists exams_created_by_idx on exams(created_by);
create index if not exists exams_status_idx on exams(status);
create index if not exists exams_window_idx on exams(window_starts_at, window_ends_at);

create table if not exists exam_sections (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  title text not null,
  section_order integer not null check (section_order > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(exam_id, section_order)
);

create index if not exists exam_sections_exam_id_idx on exam_sections(exam_id);

create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  section_id uuid not null references exam_sections(id) on delete cascade,
  question_id uuid not null references questions(id),
  question_order integer not null check (question_order > 0),
  marks integer not null check (marks > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(exam_id, question_id),
  unique(section_id, question_order)
);

create index if not exists exam_questions_exam_id_idx on exam_questions(exam_id);
create index if not exists exam_questions_section_id_idx on exam_questions(section_id);
create index if not exists exam_questions_question_id_idx on exam_questions(question_id);

create table if not exists exam_assignments (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  student_id uuid not null references users(id),
  assigned_by uuid not null references users(id),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(exam_id, student_id)
);

create index if not exists exam_assignments_exam_id_idx on exam_assignments(exam_id);
create index if not exists exam_assignments_student_id_idx on exam_assignments(student_id);

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  assignment_id uuid not null references exam_assignments(id) on delete cascade,
  student_id uuid not null references users(id),
  status text not null check (status in ('in_progress', 'submitted', 'auto_submitted', 'expired')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  score numeric(10, 2) not null default 0,
  total_marks numeric(10, 2) not null default 0,
  percentage numeric(5, 2) not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  attempted_count integer not null default 0,
  unattempted_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists exam_attempts_one_active_or_submitted_idx;

create unique index if not exists exam_attempts_one_in_progress_idx
on exam_attempts(exam_id, student_id)
where status = 'in_progress';

create index if not exists exam_attempts_assignment_id_idx on exam_attempts(assignment_id);
create index if not exists exam_attempts_student_id_idx on exam_attempts(student_id);

create table if not exists exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references exam_attempts(id) on delete cascade,
  exam_question_id uuid not null references exam_questions(id) on delete cascade,
  selected_option_id uuid references question_options(id),
  answer_text text,
  is_correct boolean,
  marks_awarded numeric(10, 2) not null default 0,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(attempt_id, exam_question_id, selected_option_id),
  check (selected_option_id is not null or answer_text is not null)
);

create index if not exists exam_attempt_answers_attempt_id_idx on exam_attempt_answers(attempt_id);
create index if not exists exam_attempt_answers_exam_question_id_idx on exam_attempt_answers(exam_question_id);

drop trigger if exists subjects_set_updated_at on subjects;
create trigger subjects_set_updated_at
before update on subjects
for each row
execute function set_updated_at();

drop trigger if exists questions_set_updated_at on questions;
create trigger questions_set_updated_at
before update on questions
for each row
execute function set_updated_at();

drop trigger if exists question_options_set_updated_at on question_options;
create trigger question_options_set_updated_at
before update on question_options
for each row
execute function set_updated_at();

drop trigger if exists exams_set_updated_at on exams;
create trigger exams_set_updated_at
before update on exams
for each row
execute function set_updated_at();

drop trigger if exists exam_sections_set_updated_at on exam_sections;
create trigger exam_sections_set_updated_at
before update on exam_sections
for each row
execute function set_updated_at();

drop trigger if exists exam_questions_set_updated_at on exam_questions;
create trigger exam_questions_set_updated_at
before update on exam_questions
for each row
execute function set_updated_at();

drop trigger if exists exam_assignments_set_updated_at on exam_assignments;
create trigger exam_assignments_set_updated_at
before update on exam_assignments
for each row
execute function set_updated_at();

drop trigger if exists exam_attempts_set_updated_at on exam_attempts;
create trigger exam_attempts_set_updated_at
before update on exam_attempts
for each row
execute function set_updated_at();

drop trigger if exists exam_attempt_answers_set_updated_at on exam_attempt_answers;
create trigger exam_attempt_answers_set_updated_at
before update on exam_attempt_answers
for each row
execute function set_updated_at();
