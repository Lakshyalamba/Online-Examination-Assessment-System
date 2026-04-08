# Step 2 Prompt

## Objective

Implement objective grading for supported objective question types.

## Exact Scope For This Prompt

- add grading logic for `SINGLE_CHOICE`
- add grading logic for `MULTIPLE_CHOICE`
- add grading logic for `TRUE_FALSE`

## Validation Before Commit

- sample answers score correctly
- unanswered answers are handled predictably
- grading remains deterministic

## Commit Gate

- one commit only
- suggested message: `feat: add objective grading strategies`

## Push Rule

- push after the commit only if representative scoring checks pass
- stop before Step 3
