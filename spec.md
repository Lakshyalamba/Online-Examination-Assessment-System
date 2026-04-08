# Online Examination Assessment System Specification

## 1. Product Overview

### Problem Statement

Colleges often run examinations through disconnected tools, manual spreadsheets, informal question collections, and inconsistent review workflows. This creates operational friction, makes auditability weak, increases grading delays, and reduces confidence in result publication.

### Solution Summary

The Online Examination Assessment System is a role-based web platform for managing the full examination lifecycle:

- user access through role-based authentication
- question bank creation and reuse
- exam composition and scheduling
- student exam attempts with timer and autosave
- objective auto-evaluation
- subjective manual review
- result generation and publication
- analytics, reporting, and audit logging

The project will be implemented as a TypeScript + Next.js modular monolith. This keeps the delivery realistic for a student team while still demonstrating system design maturity, OOP, SOLID, and design-pattern usage.

### Intended Users

- Admin: manages users, roles, operational controls, and audit visibility
- Examiner/Teacher: creates questions and exams, schedules assessments, reviews subjective answers, publishes academic results
- Student: views assigned exams, takes timed assessments, submits answers, and checks published results

### Why The System Matters

- reduces manual exam administration effort
- standardizes assessment workflows
- improves result turnaround for objective sections
- introduces clear audit trails for sensitive academic actions
- gives a strong system-design case study with multiple bounded modules and real workflow complexity

## 2. Roles And Responsibilities

### Admin

#### Responsibilities

- manage user accounts and role assignment
- activate, deactivate, or update accounts
- monitor overall system usage
- review audit logs and sensitive operations
- support governance of exam lifecycle and publication permissions

#### Permissions

- create and update Admin, Examiner, and Student accounts
- assign or revoke roles
- view all exams, attempts, results, and logs
- access operational dashboards and audit screens

#### Major Actions

- invite or create users
- update user status
- search and filter system activity
- inspect exam, attempt, and result events

#### Required Dashboards

- admin overview dashboard
- user management dashboard
- audit log dashboard
- operational reporting dashboard

#### Restricted Actions

- should not directly take exams as a student
- should not author academic content unless explicitly granted examiner capability in future extensions

### Examiner / Teacher

#### Responsibilities

- maintain the question bank
- create and edit exams
- schedule exams and assign students
- review subjective responses
- finalize and publish results for owned exams

#### Permissions

- CRUD on owned questions
- CRUD on owned draft exams
- schedule, update, and close owned exams
- access submissions, grading queues, and exam analytics

#### Major Actions

- create question bank entries
- define sections, marks, duration, and instructions
- assign eligible students
- review subjective answers
- publish results after review completion

#### Required Dashboards

- examiner overview dashboard
- question bank dashboard
- exam creation and exam detail screens
- grading and review dashboard
- result and exam analytics dashboard

#### Restricted Actions

- cannot manage global user roles
- cannot view or modify system-wide audit controls beyond exam-related records
- cannot access exams owned by other examiners unless admin policy permits

### Student

#### Responsibilities

- access assigned exams during valid windows
- complete attempts within the allotted duration
- monitor autosave and submission status
- view published results

#### Permissions

- access personal dashboard and profile
- list assigned exams
- start an exam only when eligible
- save answers, submit attempt, and view own results

#### Major Actions

- authenticate into the platform
- start exam attempt
- answer questions and monitor time remaining
- submit exam or be auto-submitted at expiry
- review published result summary and feedback

#### Required Dashboards

- student overview dashboard
- exam list page
- exam attempt page
- result detail page

#### Restricted Actions

- cannot manage questions, exams, users, results, or audit logs
- cannot access other students’ attempts or results
- cannot reopen a submitted attempt

## 3. Detailed Feature Breakdown

### 3.1 Authentication And Authorization

#### Scope

- login with institutional credentials or admin-created accounts
- logout and session invalidation
- optional invite-accept flow for first-time password setup
- route-level and server-side role protection
- action-level permission checks for sensitive operations

#### Implementation Notes

- use Auth.js with credentials-based authentication for the project scope
- store sessions in the database for auditability and role lookup consistency
- expose a central authorization policy layer instead of scattering role checks in UI code

### 3.2 User Management

#### Scope

- create user accounts
- assign role: `ADMIN`, `EXAMINER`, `STUDENT`
- activate/deactivate users
- search and filter users
- maintain lightweight profile data

#### Subfeatures

- bulk-friendly listing table
- user detail drawer or modal
- status badges
- admin-only action controls

### 3.3 Question Bank

#### Scope

- create and update questions
- support question types:
  - `SINGLE_CHOICE`
  - `MULTIPLE_CHOICE`
  - `TRUE_FALSE`
  - `SHORT_TEXT`
  - `LONG_TEXT`
- organize by topic/category
- assign difficulty:
  - `EASY`
  - `MEDIUM`
  - `HARD`
- mark whether review is manual or objective

#### Subfeatures

- topic filters
- difficulty filters
- question-type filters
- reusable option editor for objective questions
- explanation or model-answer field for reviewer reference

### 3.4 Exam Management

#### Scope

- create draft exam
- define title, code, instructions, start time, end time, duration, marks, and status
- create sections and attach questions
- assign students to the exam
- publish or schedule the exam
- edit drafts and reschedule future exams

#### Exam States

- `DRAFT`
- `SCHEDULED`
- `ACTIVE`
- `CLOSED`
- `ARCHIVED`

#### Subfeatures

- exam metadata form
- section composer
- question selection from bank
- assignment management
- schedule validation
- exam detail view with tabs for overview, questions, assignments, submissions, and results

### 3.5 Exam Attempt Engine

#### Scope

- start exam attempt
- validate eligibility and attempt rules
- create an attempt with server-calculated expiry
- retrieve questions safely
- autosave answers
- support question navigation and marked-for-review state
- final submit
- auto-submit when timer expires

#### Attempt States

- `IN_PROGRESS`
- `SUBMITTED`
- `AUTO_SUBMITTED`
- `UNDER_REVIEW`
- `EVALUATED`

#### Subfeatures

- focused exam-taking UI
- server-authoritative timer handling
- autosave indicator
- unsaved-change and expiry edge-case handling
- duplicate-submission protection

### 3.6 Evaluation And Grading

#### Scope

- objective question grading immediately after submission
- queue subjective answers for manual review
- store reviewer comments and marks
- finalize total score only after all required reviews complete

#### Subfeatures

- grading strategy by question type
- review queue filtered by exam and status
- answer-by-answer grading workspace
- marks reconciliation and finalization rules

### 3.7 Result Management

#### Scope

- aggregate objective and subjective marks
- compute percentage and grade band if configured
- control result visibility to students
- show structured result breakdown

#### Result States

- `PENDING_REVIEW`
- `READY`
- `PUBLISHED`

### 3.8 Analytics And Reporting

#### Scope

- examiner-level exam performance summary
- participation and submission statistics
- score distribution
- question difficulty performance
- admin-level user and operational overview

#### Practical Reporting Targets

- total assigned vs total attempted
- average score per exam
- pass/fail counts if grading bands are configured
- question-level correctness for objective questions
- pending review count

### 3.9 Audit Logs

#### Scope

- record sensitive actions with actor, action, entity, timestamp, and metadata
- make records searchable for admin review

#### Events To Record

- login and logout
- user creation or deactivation
- question creation or update
- exam creation, scheduling, edit, and closure
- attempt start, autosave, submit, and auto-submit
- result publish

### 3.10 Shared UI And Layout System

#### Scope

- role-aware navigation shell
- shared page header patterns
- consistent tables, forms, badges, alerts, and empty states
- responsive dashboard layout
- accessible feedback states

## 4. Major Workflows

### 4.1 User Login

1. User visits the login page.
2. User enters email and password.
3. Credentials are validated server-side.
4. A session is created if credentials are valid and the account is active.
5. The system resolves the user role and redirects to the correct dashboard.
6. A login audit event is recorded.
7. If validation fails, the user receives a clear error message without exposing sensitive details.

### 4.2 Examiner Creates An Exam

1. Examiner opens the exam management area.
2. Examiner creates a draft exam with metadata, duration, instructions, and schedule window.
3. Examiner adds sections and selects questions from the question bank.
4. The system validates that objective questions have valid answer keys and required marks.
5. Examiner assigns eligible students to the exam.
6. The system validates schedule conflicts and state transitions.
7. Examiner saves the draft.
8. Examiner publishes or schedules the exam.
9. The system persists the exam, assignments, and sections, then records an audit event.

### 4.3 Student Starts An Exam

1. Student opens the exam list.
2. The system shows only assigned exams available to that student.
3. Student selects an eligible exam and clicks start.
4. The server validates:
   - authenticated student session
   - exam assignment
   - schedule window
   - no existing submitted attempt
   - exam not manually blocked
5. The system creates an `Attempt` with `startedAt` and `expiresAt`.
6. Question payload is returned from `ExamQuestion` snapshots in the correct order for rendering.
7. The exam screen opens with timer, question panel, and autosave state.

### 4.4 Answer Autosave

1. Student edits or selects an answer.
2. The client updates local state immediately.
3. A debounced or interval-based autosave sends the answer payload to the server.
4. The server validates that:
   - the attempt belongs to the authenticated student
   - the attempt is still active
   - the exam has not expired
5. The answer is persisted to `AttemptAnswer` against the correct `ExamQuestion`.
6. `Attempt.lastSavedAt` is updated.
7. The UI shows saved, saving, or failed states.
8. If the exam expires during save, the next action moves to auto-submit handling.

### 4.5 Exam Submission

1. Student clicks submit.
2. The system shows a confirmation dialog summarizing unanswered questions.
3. Student confirms final submission.
4. The server checks that the attempt is still submittable and not already closed.
5. The attempt status changes to `SUBMITTED` or `AUTO_SUBMITTED`.
6. Objective evaluation begins immediately.
7. If the exam contains subjective answers, the attempt moves to `UNDER_REVIEW`.
8. If no subjective review is required, the attempt can move to `EVALUATED`.
9. A submission audit event is recorded.

### 4.6 Objective Grading

1. The evaluation service loads all objective answers for the attempt.
2. The correct grading strategy is chosen by question type.
3. Each answer is evaluated and marked.
4. Objective score totals are aggregated.
5. If subjective answers exist, the result remains `PENDING_REVIEW`.
6. If no subjective review is needed, the result can move to `READY` and the attempt can move to `EVALUATED`.

### 4.7 Manual Review For Subjective Answers

1. Examiner opens the grading dashboard.
2. The system lists pending review items by exam and attempt.
3. Examiner opens a response, reviews the question, model answer, and student answer.
4. Examiner assigns marks and feedback.
5. The manual review entry is stored with reviewer identity and timestamp.
6. When all subjective responses for an attempt are reviewed, final scoring is recalculated.
7. The result moves from `PENDING_REVIEW` to `READY` and the attempt moves to `EVALUATED`.

### 4.8 Result Publication

1. Examiner opens the result management area for an exam.
2. The system shows attempts by status, score summary, and review completion state.
3. Examiner publishes only `READY` results.
4. The system updates the result status to `PUBLISHED`.
5. Published results become visible to students.
6. An audit event is recorded.

### 4.9 Student Views Result

1. Student opens the results area.
2. The system lists only published results.
3. Student opens a result detail page.
4. The UI shows score summary, section-wise breakdown, answer review summary, and status.
5. If feedback exists on subjective answers, it is displayed read-only.

## 5. System Architecture

### 5.1 Architecture Style

The recommended architecture is a modular monolith inside a single Next.js application.

This is the right scope for the team because it provides:

- strong separation of concerns without distributed-system overhead
- realistic full-stack implementation within student timelines
- enough structure to demonstrate clean architecture and system design principles

### Recommended Layers

- presentation layer: Next.js pages, layouts, components, forms, route handlers
- application layer: use cases, services, orchestration, DTOs
- domain layer: entities, value objects, policies, interfaces, strategies
- infrastructure layer: Prisma repositories, auth adapter, event publishing, storage integrations

### 5.2 Recommended Module Boundaries

- `auth`
- `users`
- `questions`
- `exams`
- `attempts`
- `evaluation`
- `results`
- `reports`
- `audit`
- `shared-ui`

Each module should have clear ownership over:

- domain rules
- input validation
- repository interfaces
- use-case orchestration
- data mapping to persistence

### 5.3 Suggested Project Structure

```text
src/
  app/
    (public)/
    (auth)/
    (dashboard)/
    api/
  modules/
    auth/
      application/
      domain/
      infrastructure/
    users/
    questions/
    exams/
    attempts/
    evaluation/
    results/
    reports/
    audit/
  components/
    ui/
    layout/
  lib/
    db/
    auth/
    validation/
    events/
    utils/
```

### 5.4 Frontend Concerns

- role-aware route grouping
- protected layouts for Admin, Examiner, and Student areas
- server components for data-heavy dashboard views where practical
- client components for timed interactions, autosave, forms, and grading interactions
- accessible states for loading, error, empty, and validation feedback

### 5.5 Backend Concerns

- route handlers for autosave, submission, and JSON-style data interactions
- server actions for authenticated form workflows where practical
- dedicated service layer so UI code does not directly own business rules
- centralized authorization policy checks

### 5.6 Domain Models

Key domain models:

- `User`
- `Exam`
- `ExamSection`
- `Question`
- `Option`
- `QuestionTopic`
- `ExamQuestion`
- `ExamAssignment`
- `Attempt`
- `AttemptAnswer`
- `ManualReview`
- `Result`
- `AuditLog`

### 5.7 Data Access Layer

- repository interfaces live in the domain/application boundary
- Prisma implementations live in infrastructure
- repositories return stable domain-friendly objects, not raw ORM payloads everywhere

### 5.8 Shared Utilities

- validation schemas
- date and timezone helpers
- timer helpers
- pagination and filtering helpers
- audit event helpers
- score formatting and grade utilities

### 5.9 Caching And Session Considerations

- database sessions are sufficient for the project scope
- no mandatory distributed cache is required for MVP delivery
- do not treat client-side timer state as the source of truth
- optional future improvement: cache low-volatility reference data such as topic lists and dashboard aggregates

### 5.10 Data Integrity And Auditability

- `Attempt.expiresAt` must be set server-side at attempt creation
- `AttemptAnswer` must reference the correct `ExamQuestion` snapshot
- autosave must validate that the attempt remains active
- submission must be idempotent
- objective grading should run within a controlled service transaction boundary
- results must not publish until all mandatory subjective reviews are complete
- sensitive actions must create audit log records

## 6. Suggested Technical Stack

### Core Application

- Next.js with App Router
- React
- TypeScript

### Persistence

- PostgreSQL
- Prisma ORM

### Authentication

- Auth.js
- credentials-based login for project scope
- database-backed session strategy

### Validation And Data Contracts

- Zod for request validation and form schemas

### UI

- Tailwind CSS
- a small internal component system built from accessible primitives
- charting library for dashboards and reporting

### Testing

- unit and service-level tests with a TypeScript-friendly runner
- component tests for important interactive UI
- browser-based end-to-end verification for critical flows if available

### Development Tooling

- ESLint
- Prettier
- Prisma migrations and seed data

## 7. Data Model Overview

### User

Represents every authenticated person in the system.

Key fields:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `status`
- `createdAt`
- `lastLoginAt`

Relationships:

- creates questions
- creates exams
- takes attempts as a student
- reviews answers as an examiner
- appears as actor in audit logs

### Exam

Represents an assessment definition and schedule.

Key fields:

- `id`
- `code`
- `title`
- `description`
- `instructions`
- `status`
- `durationMinutes`
- `startAt`
- `endAt`
- `totalMarks`
- `createdById`

Relationships:

- has many `ExamSection`
- has many `ExamQuestion`
- has many `ExamAssignment`
- has many `Attempt`

### ExamSection

Logical grouping of questions inside an exam.

Key fields:

- `id`
- `examId`
- `title`
- `description`
- `sectionOrder`
- `marksWeight`

### Question

Reusable bank item authored by an examiner.

Key fields:

- `id`
- `type`
- `stem`
- `difficulty`
- `expectedAnswer`
- `explanation`
- `topicId`
- `createdById`

Relationships:

- has many `Option`
- can be linked to many exams through `ExamQuestion` snapshot records

### Option

Selectable choice for objective questions.

Key fields:

- `id`
- `questionId`
- `label`
- `text`
- `isCorrect`
- `optionOrder`

### QuestionTopic

Topic or category for question organization.

Key fields:

- `id`
- `name`
- `description`

### ExamQuestion

Join entity between exam and question with exam-specific settings and a snapshot of the bank question at the time the exam is prepared.

Key fields:

- `id`
- `examId`
- `questionId`
- `sectionId`
- `questionOrder`
- `marks`
- `questionSnapshot`

### ExamAssignment

Defines which student can take which exam.

Key fields:

- `id`
- `examId`
- `studentId`
- `assignedAt`

### Attempt

Represents one student’s sitting for an exam.

Key fields:

- `id`
- `examId`
- `studentId`
- `status`
- `startedAt`
- `expiresAt`
- `submittedAt`
- `lastSavedAt`
- `objectiveScore`
- `subjectiveScore`
- `finalScore`

Relationships:

- has many `AttemptAnswer`
- has one `Result`

### AttemptAnswer

Stores the response for one question inside an attempt.

Key fields:

- `id`
- `attemptId`
- `examQuestionId`
- `responseText`
- `selectedOptionIds`
- `isMarkedForReview`
- `saveVersion`
- `lastSavedAt`

Relationships:

- belongs to one `Attempt`
- belongs to one `ExamQuestion`
- may have one `ManualReview`

### ManualReview

Stores examiner review outcome for subjective answers.

Key fields:

- `id`
- `attemptAnswerId`
- `reviewerId`
- `marksAwarded`
- `feedback`
- `status`
- `reviewedAt`

### Result

Represents final outcome visibility for a student attempt.

Key fields:

- `id`
- `attemptId`
- `status`
- `objectiveScore`
- `subjectiveScore`
- `finalScore`
- `percentage`
- `gradeLabel`
- `publishedAt`
- `publishedById`

### AuditLog

Tracks sensitive operations.

Key fields:

- `id`
- `actorId`
- `action`
- `entityType`
- `entityId`
- `metadata`
- `createdAt`
- `ipAddress`

## 8. API And Action Surface

This project can use a mix of server actions and route handlers. The logical surface below is the required contract, regardless of transport choice.

### 8.1 Auth

#### `auth.login`

- purpose: authenticate user and create session
- input: email, password
- output: authenticated session context, target dashboard route
- validation: required fields, active user, valid credentials
- authorization: public

#### `auth.logout`

- purpose: destroy session
- input: current session
- output: success flag
- validation: authenticated session exists
- authorization: authenticated user

### 8.2 Users

#### `users.list`

- purpose: list users with filters and pagination
- input: role filter, status filter, search query, page
- output: paginated user collection
- validation: bounded page size, valid filter enums
- authorization: Admin only

#### `users.create`

- purpose: create user account
- input: name, email, role, initial password or invite mode
- output: created user summary
- validation: unique email, valid role, password policy
- authorization: Admin only

#### `users.updateStatus`

- purpose: activate or deactivate user
- input: userId, status
- output: updated user summary
- validation: target exists, role-protected admin cannot deactivate self without safeguards
- authorization: Admin only

### 8.3 Questions

#### `questions.create`

- purpose: add question to question bank
- input: type, stem, difficulty, topic, options or expected answer, explanation
- output: created question
- validation: type-specific schema, objective questions need valid option rules
- authorization: Examiner and Admin if policy allows

#### `questions.list`

- purpose: retrieve filterable bank of questions
- input: topic, difficulty, type, search query, page
- output: paginated question collection
- validation: bounded filters
- authorization: Examiner and Admin

### 8.4 Exams

#### `exams.createDraft`

- purpose: create draft exam metadata
- input: title, code, instructions, duration, startAt, endAt
- output: draft exam summary
- validation: start before end, positive duration, unique or valid code format
- authorization: Examiner

#### `exams.attachQuestions`

- purpose: add sections and question mappings to an exam
- input: examId, section definitions, question selections, marks
- output: updated exam structure
- validation: question existence, marks > 0, valid order values
- authorization: owning Examiner

#### `exams.assignStudents`

- purpose: define eligible candidates
- input: examId, list of studentIds
- output: assignment summary
- validation: student role only, deduplicated list
- authorization: owning Examiner or Admin

#### `exams.publish`

- purpose: move exam to scheduled availability
- input: examId
- output: updated exam state
- validation: exam contains questions, schedule valid, at least one assignment
- authorization: owning Examiner

### 8.5 Attempts

#### `attempts.startExam`

- purpose: create active attempt
- input: examId
- output: attempt summary, question payload, expiry timestamp
- validation: assignment exists, within schedule, not already submitted, exam status valid
- authorization: Student assigned to exam

#### `attempts.getSession`

- purpose: load active attempt page data
- input: attemptId
- output: attempt state, question payload, saved answers, expiry timestamp
- validation: ownership, active attempt state
- authorization: owning Student

#### `attempts.saveAnswer`

- purpose: autosave answer progress
- input: attemptId, examQuestionId, response payload, markForReview flag
- output: save timestamp, answer state
- validation: active attempt, exam question belongs to that attempt’s exam, response matches question type
- authorization: owning Student

#### `attempts.submit`

- purpose: finalize attempt
- input: attemptId, optional final answer snapshot
- output: attempt status, result preview status
- validation: active attempt, not already submitted, exam ownership, expiry rules
- authorization: owning Student

### 8.6 Evaluation

#### `evaluation.runObjectiveGrading`

- purpose: score objective answers after submission
- input: attemptId
- output: objective score summary
- validation: attempt submitted, not already graded
- authorization: internal service only

#### `evaluation.listPendingReviews`

- purpose: list subjective responses awaiting marking
- input: examId, status filter, page
- output: paginated review queue
- validation: exam exists and requester owns it
- authorization: owning Examiner

#### `evaluation.reviewAnswer`

- purpose: record marks and feedback for a subjective answer
- input: attemptAnswerId, marksAwarded, feedback
- output: updated manual review status
- validation: answer belongs to owned exam, marks within range
- authorization: owning Examiner

### 8.7 Results

#### `results.getExamResults`

- purpose: list result summaries for one exam
- input: examId, filters, page
- output: result collection with statuses
- validation: exam exists, requester owns it or is admin
- authorization: Examiner owner or Admin

#### `results.publish`

- purpose: make ready results visible to students
- input: examId or resultIds
- output: publication summary
- validation: only `READY` results, no pending reviews
- authorization: owning Examiner or Admin if policy allows

#### `results.getStudentResult`

- purpose: return one student’s published result detail
- input: resultId
- output: result detail payload
- validation: ownership, `PUBLISHED` status
- authorization: owning Student

### 8.8 Reports

#### `reports.getExamAnalytics`

- purpose: return performance metrics for an exam
- input: examId
- output: participation, score distribution, objective accuracy, review counts
- validation: exam exists
- authorization: owning Examiner or Admin

#### `reports.getAdminOverview`

- purpose: return operational metrics
- input: date range filters
- output: user counts, exam counts, active review queue, audit summary
- validation: allowed range and filters
- authorization: Admin only

### 8.9 Audit

#### `audit.listLogs`

- purpose: search audit events
- input: actor filter, entity filter, action filter, date range, page
- output: paginated audit event collection
- validation: bounded filters and range
- authorization: Admin only

## 9. Validation Rules And Edge Cases

- exam started too early: student receives locked-state message with schedule details
- exam already ended: attempt start is blocked
- multiple attempts not allowed: existing submitted or active attempt blocks new creation
- inactive account: login denied
- invalid role accessing restricted screen: route blocked and logged
- timer expires mid-session: attempt transitions to auto-submit flow
- duplicate submission request: second request returns existing final state without double-processing
- missing answers on submit: allowed, but confirmation warns about unanswered questions
- autosave after submission: rejected gracefully
- autosave payload for wrong question type: validation error
- subjective answer pending review: student result remains hidden or marked pending based on status
- result publish before all reviews complete: blocked
- exam publication without assignments or questions: blocked
- question with invalid objective key: blocked at create/update time
- examiner accessing another examiner’s exam: blocked unless admin override policy is implemented

## 10. Security Considerations

- enforce RBAC on routes, actions, and service layer methods
- never rely only on client role state for protection
- store sessions securely and invalidate on logout
- validate all inputs with shared schemas
- use server-side time as authority for exam schedules and expiry
- rate limit login and high-frequency save endpoints where practical
- log sensitive actions in audit trail
- keep password storage hashed and never log credentials
- avoid sending correct answers to the client during exam attempts
- do not include invasive or unrealistic AI proctoring in project scope

## 11. Testing Expectations

### Unit Testing Focus

- question validation rules
- evaluation strategies by question type
- score aggregation logic
- exam eligibility rules
- result status transitions
- authorization policy helpers

### Integration Testing Focus

- repository behavior for exam, attempt, and result flows
- attempt creation and submission service orchestration
- objective grading plus result generation
- manual review completion updating result state
- audit log creation on sensitive actions

### Browser Testing Focus

- login and role redirects
- question bank CRUD flow
- exam creation and scheduling flow
- student exam attempt flow with timer and autosave indicators
- submit confirmation and post-submit behavior
- manual review workflow
- result publication and student result viewing
- admin user management and audit filters

### Manual Verification Checklist

- verify responsive layouts on major pages
- verify role-based menus only show relevant destinations
- verify empty, loading, and error states
- verify validation messages are clear and non-breaking
- verify timed exam UI remains usable during real interaction

### Acceptance Criteria By Module

#### Authentication And Authorization

- users can log in and be redirected by role
- protected routes reject unauthorized access
- role-based actions are enforced server-side

#### User Management

- admin can list, create, update, and deactivate users
- non-admins cannot access management routes

#### Question Bank

- examiner can manage questions with topic, difficulty, and type
- invalid question structures are blocked

#### Exam Management

- examiner can create, update, assign, and publish exams
- invalid schedule or empty exam structures are blocked

#### Exam Attempt Engine

- student can start only eligible exams
- autosave persists data
- submission finalizes the attempt exactly once

#### Evaluation And Results

- objective grading runs correctly
- subjective review queue updates result readiness
- published results appear only to the correct student

#### Analytics And Audit

- examiner sees exam-level metrics
- admin sees operational metrics and audit entries

## 12. OOP, SOLID, And Design Pattern Expectations

### OOP Alignment

- Encapsulation: entities and value objects should own validation-sensitive state changes where practical
- Abstraction: services depend on repository interfaces and policy abstractions rather than direct infrastructure details
- Inheritance: question types can derive from a common base abstraction in the domain model
- Polymorphism: evaluation behavior varies by question type through interchangeable strategies

### SOLID Alignment

- Single Responsibility Principle: separate exam composition, attempt handling, grading, results, and audit concerns
- Open/Closed Principle: add new question types through new strategies and factory registrations instead of rewriting existing logic
- Liskov Substitution Principle: all question strategy implementations must honor shared evaluation contracts
- Interface Segregation Principle: keep repository and service contracts focused on module-specific needs
- Dependency Inversion Principle: application services depend on interfaces, not Prisma or framework-specific details

### Required Design Patterns

- Strategy Pattern: grading strategies for objective and subjective question types
- Factory Pattern: create question or evaluation handlers based on question type
- Repository Pattern: isolate persistence access for users, exams, attempts, results, and logs

### Optional Patterns That Fit Naturally

- Observer/Event-Driven Pattern: publish domain events for audit logging and notifications
- Adapter Pattern: wrap auth provider or chart/report data transformations
- Builder Pattern: assemble complex exam structures with sections and question mappings

## 13. Out Of Scope

The following are intentionally excluded from the student delivery scope:

- AI proctoring
- face recognition
- camera or microphone surveillance
- plagiarism detection
- payments
- native mobile application
- full LMS integration
- advanced offline exam sync
- institution-wide multi-tenant deployment concerns

These may be listed as future enhancements, but they should not drive implementation complexity now.

## 14. Delivery Roadmap

### Phase 1: Foundations

- initialize project structure
- set up database schema and seed data
- implement authentication, sessions, RBAC, and shared layouts

### Phase 2: Authoring And Scheduling

- question bank
- exam creation
- section management
- assignment management

### Phase 3: Student Exam Engine

- student dashboard
- exam list
- timed attempt interface
- autosave and submission

### Phase 4: Evaluation And Results

- objective grading
- manual review workflow
- result generation and publication

### Phase 5: Operations And Polish

- admin screens
- audit logs
- analytics and reporting
- accessibility pass
- testing pass
- final documentation and demo preparation

## 15. Definition Of Done

The project is complete enough for the student milestone when all of the following are true:

- Admin, Examiner, and Student roles can authenticate and reach correct dashboards
- user management, question bank, exam management, attempt flow, grading, results, analytics, and audit logs are implemented at MVP level
- core workflows complete without breaking shared contracts
- objective grading works correctly for supported objective question types
- subjective review workflow works correctly for supported subjective question types
- result publication is controlled and visible only after readiness
- major edge cases are handled cleanly
- key routes are responsive and accessible enough for demonstration
- diagrams, spec, and design docs remain aligned with implementation
- local verification and browser checks have been run for each implemented module
