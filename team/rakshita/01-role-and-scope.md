# Role And Scope

You own the examiner-side authoring workflow.

## What You Own

- question bank CRUD
- question type handling and validation
- topic and difficulty filtering
- exam draft creation
- section and question composition
- exam scheduling and student assignment
- examiner exam detail views for authored exams

## What You Do Not Own

- authentication or shared shell foundations
- student attempt runtime logic
- grading queue behavior and result publication logic
- admin-only user management and audit pages

## Eight-Prompt Commit Map

1. question domain types, schemas, and shared authoring utilities
2. question bank listing, filters, and search
3. create-question flow for objective types
4. edit, preview, and subjective-question handling
5. draft exam metadata and schedule forms
6. section builder and question-mapping flow
7. assignment flow and publish-readiness checks
8. examiner exam detail page and authoring polish

## Success Criteria

- examiners can create valid questions and exams without schema confusion
- invalid question or exam configurations are blocked
- published exams have the required structure to drive attempts later
- UI follows the examiner patterns in `design.md`

## Coordination Notes

- preserve snapshot-friendly `ExamQuestion` modeling
- keep student assignment explicit, not implied
- do not build grading behavior into authoring pages
