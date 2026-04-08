# Role And Scope

You own the student-facing runtime flow.

## What You Own

- student dashboard
- assigned exam listing
- exam start and eligibility UI
- timed attempt interface
- answer navigation and marked-for-review behavior
- autosave interaction pattern
- final submission and timeout handling UI

## What You Do Not Own

- question bank or exam authoring
- grading logic
- result publication logic
- admin user management, audit, or analytics pages

## Eight-Prompt Commit Map

1. student route entry and dashboard shell wiring
2. assigned exam list and status mapping
3. exam start eligibility and attempt bootstrap
4. exam layout, timer bar, and question render frame
5. answer inputs and question navigation
6. autosave, recovery, and refresh-resume behavior
7. submit confirmation and timeout handling
8. post-submit states and student-flow polish

## Success Criteria

- assigned students can start eligible exams
- answers save reliably during the attempt
- timer behavior is trustworthy and clear
- final submission works exactly once
- UI remains accessible and readable under time pressure
