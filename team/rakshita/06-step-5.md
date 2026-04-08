# Step 5 Prompt

## Objective

Build the draft exam metadata and schedule foundation.

## Exact Scope For This Prompt

- create draft exam flow
- exam title, code, instructions, duration, and window fields
- validate schedule basics and required metadata

## Likely Touch Surface

- `src/modules/exams/`
- create-exam page
- metadata and schedule form sections

## Validation Before Commit

- draft exams can be created
- invalid schedule windows are blocked
- metadata fields persist correctly

## Commit Gate

- one commit only
- suggested message: `feat: add draft exam metadata and schedule forms`

## Push Rule

- push after the commit only if draft creation is browser-checked
- stop before Step 6
