# 03. Sequence Diagram: Student Attempt

## 1. Diagram Purpose

Describe the full timed exam-taking sequence from access validation through autosave, submission, grading, and result-state generation.

## 2. Why It Matters For The Project

The attempt flow is the most sensitive runtime path in the system. It touches authentication, schedule validation, timer rules, autosave integrity, grading, and result state transitions.

## 3. Elements To Include

- Student
- Browser UI
- Auth/RBAC Guard
- Attempt Service
- Exam Repository
- Attempt Repository
- Evaluation Service
- Result Service
- Audit Service

## 4. Relationships, Connections, And Arrows To Draw

- student requests start from the browser UI
- auth guard validates session and role
- attempt service validates assignment, schedule, and prior-attempt rules
- exam repository loads exam snapshot
- attempt repository creates and updates attempt state
- evaluation service grades objective questions after submission
- result service creates or updates result state
- audit service records attempt start, autosave milestones, and submission

## 5. Important Notes And Annotations

- the server, not the client, is the authority for `expiresAt`
- autosave should be shown as a loop and not as a blocking interaction
- final submission must be idempotent
- subjective review should move the result to `PENDING_REVIEW`, not block the submission response indefinitely

## 6. Suggested Visual Grouping In Figma

- place user-facing participants on the left
- keep repositories in a narrower infrastructure band on the right
- use alt frames for success, blocked-start, and pending-review branches
- use loop frame for autosave

## 7. Textual Structured Diagram Definition

```mermaid
sequenceDiagram
    actor Student
    participant UI as Browser UI
    participant Auth as Auth/RBAC Guard
    participant AttemptSvc as Attempt Service
    participant ExamRepo as Exam Repository
    participant AttemptRepo as Attempt Repository
    participant EvalSvc as Evaluation Service
    participant ResultSvc as Result Service
    participant Audit as Audit Service

    Student->>UI: Open assigned exam
    UI->>Auth: Validate session and role
    Auth-->>UI: Session valid for Student
    UI->>AttemptSvc: startExam(examId, studentId)
    AttemptSvc->>ExamRepo: loadExamForAttempt(examId, studentId)
    ExamRepo-->>AttemptSvc: exam, assignment, schedule, examQuestions
    AttemptSvc->>AttemptRepo: checkExistingAttempt(studentId, examId)
    AttemptRepo-->>AttemptSvc: none or active/submitted attempt

    alt Student is eligible and no blocking attempt exists
        AttemptSvc->>AttemptRepo: createAttempt(startedAt, expiresAt, status=IN_PROGRESS)
        AttemptRepo-->>AttemptSvc: attempt
        AttemptSvc->>Audit: record AttemptStarted
        AttemptSvc-->>UI: attempt session payload
        UI-->>Student: Render exam, timer, question navigation

        loop While attempt is active
            Student->>UI: Answer or update question
            UI->>AttemptSvc: saveAnswer(attemptId, examQuestionId, response)
            AttemptSvc->>AttemptRepo: persistAttemptAnswer(...)
            AttemptRepo-->>AttemptSvc: savedAt, saveVersion
            AttemptSvc-->>UI: autosave success
        end

        alt Student clicks submit before expiry
            Student->>UI: Confirm final submit
            UI->>AttemptSvc: submitAttempt(attemptId)
        else Timer expires
            UI->>AttemptSvc: autoSubmitAttempt(attemptId)
        end

        AttemptSvc->>AttemptRepo: lock and finalize attempt
        AttemptRepo-->>AttemptSvc: attempt status SUBMITTED or AUTO_SUBMITTED
        AttemptSvc->>EvalSvc: runObjectiveEvaluation(attemptId)
        EvalSvc->>AttemptRepo: loadSubmittedAnswers(attemptId)
        AttemptRepo-->>EvalSvc: answer set
        EvalSvc-->>AttemptSvc: objective score summary
        AttemptSvc->>ResultSvc: createOrUpdateResult(attemptId, score summary)

        alt Subjective answers exist
            ResultSvc-->>AttemptSvc: result status = PENDING_REVIEW
        else Objective-only exam
            ResultSvc-->>AttemptSvc: result status = READY
        end

        AttemptSvc->>Audit: record AttemptSubmitted
        AttemptSvc-->>UI: submission accepted with result status
        UI-->>Student: Show submitted confirmation
    else Attempt start is blocked
        AttemptSvc-->>UI: eligibility or duplicate-attempt error
        UI-->>Student: Show blocked state with reason
    end
```

## 8. Common Mistakes To Avoid

- do not place timer truth entirely in the browser
- do not allow autosave after the attempt is finalized
- do not show subjective grading as synchronous inline work in the submission response
- do not omit the blocked-start branch for schedule or duplicate-attempt rules
- do not forget to record audit events on start and submit transitions
