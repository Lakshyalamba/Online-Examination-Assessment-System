# Step 7 Prompt

## Objective

Implement submit confirmation and timeout handling.

## Exact Scope For This Prompt

- submit confirmation modal
- unanswered-question summary
- duplicate-submit protection at the UI boundary
- timeout or auto-submit handling presentation

## Validation Before Commit

- submit confirmation works
- duplicate submit clicks do not create ambiguous UI
- timeout path produces a stable final state

## Commit Gate

- one commit only
- suggested message: `feat: add submit confirmation and timeout handling`

## Push Rule

- push after the commit only if a full submit path is browser-tested
- stop before Step 8
