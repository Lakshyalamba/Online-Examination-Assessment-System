# 05. ER Diagram

## 1. Diagram Purpose

Show the practical database-level structure for the core entities and their relationships.

## 2. Why It Matters For The Project

The ER diagram gives the team a common reference for schema design, foreign keys, and cardinality. It is the main alignment tool between feature owners and data-layer implementation.

## 3. Elements To Include

- `User`
- `QuestionTopic`
- `Question`
- `Option`
- `Exam`
- `ExamSection`
- `ExamQuestion`
- `ExamAssignment`
- `Attempt`
- `AttemptAnswer`
- `ManualReview`
- `Result`
- `AuditLog`

## 4. Relationships, Connections, And Arrows To Draw

- one `User` creates many `Exam` records
- one `User` creates many `Question` records
- one `QuestionTopic` groups many `Question` records
- one `Question` can have many `Option` records
- one `Exam` has many `ExamSection` records
- one `ExamSection` has many `ExamQuestion` records
- one `Question` can appear in many `ExamQuestion` records
- one `Exam` has many `ExamAssignment` records
- one `Student User` can receive many `ExamAssignment` records
- one `Exam` has many `Attempt` records
- one `Student User` can have many `Attempt` records across exams
- one `Attempt` has many `AttemptAnswer` records
- one `AttemptAnswer` references one `ExamQuestion`
- one `AttemptAnswer` may have zero or one `ManualReview`
- one `Attempt` has exactly one `Result`
- one `AuditLog` references one actor `User`

## 5. Important Notes And Annotations

- show unique constraint intent for one assignment per `(examId, studentId)`
- show unique constraint intent for one result per `attemptId`
- `ExamQuestion` should be treated as the exam snapshot table, not just a thin join
- `AttemptAnswer` should reference `examQuestionId` so grading uses the exact question snapshot presented during the attempt

## 6. Suggested Visual Grouping In Figma

- left group: user and question bank entities
- center group: exam-authoring entities
- right group: attempt, grading, result, and audit entities
- keep join entities clearly visible instead of hiding them between larger boxes

## 7. Textual Structured Diagram Definition

```mermaid
erDiagram
    USER {
        uuid id PK
        string name
        string email
        string password_hash
        string role
        string status
        datetime created_at
        datetime last_login_at
    }

    QUESTION_TOPIC {
        uuid id PK
        string name
        string description
    }

    QUESTION {
        uuid id PK
        uuid topic_id FK
        uuid created_by_id FK
        string type
        string difficulty
        text stem
        text expected_answer
        text explanation
        datetime created_at
    }

    OPTION {
        uuid id PK
        uuid question_id FK
        string label
        text text
        boolean is_correct
        int option_order
    }

    EXAM {
        uuid id PK
        uuid created_by_id FK
        string code
        string title
        string status
        text description
        text instructions
        int duration_minutes
        int total_marks
        datetime start_at
        datetime end_at
        datetime created_at
    }

    EXAM_SECTION {
        uuid id PK
        uuid exam_id FK
        string title
        text description
        int section_order
        int marks_weight
    }

    EXAM_QUESTION {
        uuid id PK
        uuid exam_id FK
        uuid section_id FK
        uuid question_id FK
        int question_order
        int marks
        json question_snapshot
    }

    EXAM_ASSIGNMENT {
        uuid id PK
        uuid exam_id FK
        uuid student_id FK
        datetime assigned_at
    }

    ATTEMPT {
        uuid id PK
        uuid exam_id FK
        uuid student_id FK
        string status
        datetime started_at
        datetime expires_at
        datetime submitted_at
        datetime last_saved_at
        decimal objective_score
        decimal subjective_score
        decimal final_score
    }

    ATTEMPT_ANSWER {
        uuid id PK
        uuid attempt_id FK
        uuid exam_question_id FK
        text response_text
        json selected_option_ids
        boolean is_marked_for_review
        int save_version
        datetime last_saved_at
    }

    MANUAL_REVIEW {
        uuid id PK
        uuid attempt_answer_id FK
        uuid reviewer_id FK
        decimal marks_awarded
        text feedback
        string status
        datetime reviewed_at
    }

    RESULT {
        uuid id PK
        uuid attempt_id FK
        string status
        decimal objective_score
        decimal subjective_score
        decimal final_score
        decimal percentage
        string grade_label
        datetime published_at
        uuid published_by_id FK
    }

    AUDIT_LOG {
        uuid id PK
        uuid actor_id FK
        string action
        string entity_type
        uuid entity_id
        json metadata
        string ip_address
        datetime created_at
    }

    USER ||--o{ EXAM : creates
    USER ||--o{ QUESTION : authors
    QUESTION_TOPIC ||--o{ QUESTION : categorizes
    QUESTION ||--o{ OPTION : has
    EXAM ||--o{ EXAM_SECTION : contains
    EXAM_SECTION ||--o{ EXAM_QUESTION : orders
    QUESTION ||--o{ EXAM_QUESTION : appears_in
    EXAM ||--o{ EXAM_ASSIGNMENT : targets
    USER ||--o{ EXAM_ASSIGNMENT : assigned_student
    EXAM ||--o{ ATTEMPT : has
    USER ||--o{ ATTEMPT : takes
    ATTEMPT ||--o{ ATTEMPT_ANSWER : stores
    EXAM_QUESTION ||--o{ ATTEMPT_ANSWER : answered_as
    ATTEMPT_ANSWER ||--o| MANUAL_REVIEW : may_require
    USER ||--o{ MANUAL_REVIEW : performs
    ATTEMPT ||--|| RESULT : yields
    USER ||--o{ AUDIT_LOG : acts_in
```

## 8. Common Mistakes To Avoid

- do not remove join entities such as `EXAM_QUESTION` or `EXAM_ASSIGNMENT`
- do not connect students directly to exams without assignment modeling
- do not collapse `ATTEMPT_ANSWER` and `MANUAL_REVIEW` into one table in the visual
- do not forget one-to-one intent between `ATTEMPT` and `RESULT`
- do not omit audit metadata and actor linkage
