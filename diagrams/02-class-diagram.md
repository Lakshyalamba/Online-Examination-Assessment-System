# 02. Class Diagram

## 1. Diagram Purpose

Describe the core domain objects, selected service abstractions, and design-pattern alignment of the system.

## 2. Why It Matters For The Project

This diagram ties the project directly to OOP, SOLID, and the required design patterns. It helps the team model the domain cleanly instead of scattering logic across pages and APIs.

## 3. Elements To Include

- domain classes:
  - User
  - Exam
  - ExamSection
  - QuestionTopic
  - Question
  - SingleChoiceQuestion
  - MultipleChoiceQuestion
  - TrueFalseQuestion
  - ShortTextQuestion
  - LongTextQuestion
  - Option
  - ExamQuestion
  - ExamAssignment
  - Attempt
  - AttemptAnswer
  - ManualReview
  - Result
  - AuditLog
- abstractions and services:
  - EvaluationStrategy
  - SingleChoiceEvaluationStrategy
  - MultipleChoiceEvaluationStrategy
  - TrueFalseEvaluationStrategy
  - SubjectiveEvaluationStrategy
  - EvaluationStrategyFactory
  - QuestionFactory
  - IExamRepository
  - IAttemptRepository
  - IResultRepository
  - ExamService
  - AttemptService
  - EvaluationService

## 4. Relationships, Connections, And Arrows To Draw

- `Question` is the abstract base for specific question types
- `Exam` composes `ExamSection`
- `ExamSection` aggregates ordered `ExamQuestion` records
- `Question` composes `Option` for objective variants
- `QuestionTopic` groups `Question`
- `ExamQuestion` references a bank question and stores exam-specific snapshot data
- `ExamAssignment` links one `Exam` to one student `User`
- `Attempt` belongs to one `Exam` and one student `User`
- `Attempt` composes many `AttemptAnswer`
- `AttemptAnswer` references one `ExamQuestion`
- `ManualReview` is attached to an `AttemptAnswer` when needed
- `Result` belongs to an `Attempt`
- application services depend on repository interfaces, not concrete database implementations
- `EvaluationService` depends on `EvaluationStrategyFactory`

## 5. Important Notes And Annotations

- inheritance should be shown primarily through question-type specialization
- the diagram should visually separate domain entities from service and repository abstractions
- repository interfaces demonstrate dependency inversion
- strategy objects should be shown as interchangeable evaluators selected by type
- `ExamQuestion` is the snapshot boundary that protects already-published exams from future edits to the bank question

## 6. Suggested Visual Grouping In Figma

- left cluster: domain entities and aggregates
- center cluster: question-type inheritance hierarchy
- right cluster: application services and repository abstractions
- bottom cluster: evaluation strategy family and factory

## 7. Textual Structured Diagram Definition

```mermaid
classDiagram
    class User {
      +id: UUID
      +name: string
      +email: string
      +role: UserRole
      +status: UserStatus
    }

    class Exam {
      +id: UUID
      +code: string
      +title: string
      +status: ExamStatus
      +durationMinutes: number
      +startAt: DateTime
      +endAt: DateTime
      +publish()
      +close()
    }

    class ExamSection {
      +id: UUID
      +title: string
      +sectionOrder: number
      +marksWeight: number
    }

    class QuestionTopic {
      +id: UUID
      +name: string
    }

    class Question {
      <<abstract>>
      +id: UUID
      +stem: string
      +difficulty: Difficulty
      +type: QuestionType
      +expectedAnswer: string
    }

    class SingleChoiceQuestion
    class MultipleChoiceQuestion
    class TrueFalseQuestion
    class ShortTextQuestion
    class LongTextQuestion

    class Option {
      +id: UUID
      +label: string
      +text: string
      +isCorrect: boolean
    }

    class ExamQuestion {
      +id: UUID
      +questionOrder: number
      +marks: number
      +questionSnapshot: json
    }

    class ExamAssignment {
      +id: UUID
      +assignedAt: DateTime
    }

    class Attempt {
      +id: UUID
      +status: AttemptStatus
      +startedAt: DateTime
      +expiresAt: DateTime
      +submittedAt: DateTime
      +submit()
      +isExpired()
    }

    class AttemptAnswer {
      +id: UUID
      +responseText: string
      +selectedOptionIds: string[]
      +isMarkedForReview: boolean
      +saveVersion: number
    }

    class ManualReview {
      +id: UUID
      +marksAwarded: number
      +feedback: string
      +status: ReviewStatus
    }

    class Result {
      +id: UUID
      +status: ResultStatus
      +objectiveScore: number
      +subjectiveScore: number
      +finalScore: number
      +percentage: number
      +publish()
    }

    class AuditLog {
      +id: UUID
      +action: string
      +entityType: string
      +entityId: UUID
      +metadata: json
    }

    class EvaluationStrategy {
      <<interface>>
      +evaluate(answer, examQuestion): Score
    }

    class SingleChoiceEvaluationStrategy
    class MultipleChoiceEvaluationStrategy
    class TrueFalseEvaluationStrategy
    class SubjectiveEvaluationStrategy

    class EvaluationStrategyFactory {
      +getStrategy(type): EvaluationStrategy
    }

    class QuestionFactory {
      +createQuestion(type, payload): Question
    }

    class IExamRepository {
      <<interface>>
      +save(exam)
      +findById(id)
    }

    class IAttemptRepository {
      <<interface>>
      +create(attempt)
      +saveAnswer(answer)
      +submitAttempt(id)
    }

    class IResultRepository {
      <<interface>>
      +save(result)
      +findByAttemptId(id)
    }

    class ExamService
    class AttemptService
    class EvaluationService

    Question <|-- SingleChoiceQuestion
    Question <|-- MultipleChoiceQuestion
    Question <|-- TrueFalseQuestion
    Question <|-- ShortTextQuestion
    Question <|-- LongTextQuestion

    Exam "1" *-- "many" ExamSection
    ExamSection "1" *-- "many" ExamQuestion
    QuestionTopic "1" --> "many" Question
    Question "1" *-- "many" Option
    ExamQuestion "many" --> "1" Question : sourcedFrom
    Exam "1" --> "many" ExamAssignment
    ExamAssignment "many" --> "1" User : student
    Exam "1" --> "many" Attempt
    Attempt "many" --> "1" User : student
    Attempt "1" *-- "many" AttemptAnswer
    AttemptAnswer "many" --> "1" ExamQuestion
    AttemptAnswer "1" --> "0..1" ManualReview
    Attempt "1" --> "1" Result
    AuditLog "many" --> "1" User : actor

    EvaluationStrategy <|.. SingleChoiceEvaluationStrategy
    EvaluationStrategy <|.. MultipleChoiceEvaluationStrategy
    EvaluationStrategy <|.. TrueFalseEvaluationStrategy
    EvaluationStrategy <|.. SubjectiveEvaluationStrategy
    EvaluationStrategyFactory ..> EvaluationStrategy
    QuestionFactory ..> Question

    ExamService ..> IExamRepository
    AttemptService ..> IAttemptRepository
    EvaluationService ..> IAttemptRepository
    EvaluationService ..> IResultRepository
    EvaluationService ..> EvaluationStrategyFactory
```

## 8. Common Mistakes To Avoid

- do not turn entities into active-record style database objects
- do not omit the question snapshot semantics of `ExamQuestion`
- do not place manual-review fields directly on `Attempt`
- do not blur domain entities and infrastructure adapters into one visual group
- do not forget that evaluation strategies are selected by question type, not hard-coded into the attempt page
