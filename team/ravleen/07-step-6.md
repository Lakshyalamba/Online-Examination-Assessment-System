# Step 6 Prompt

## Objective

Implement review completion behavior and publication gating.

## Exact Scope For This Prompt

- move reviewed answers to complete state
- re-run readiness checks when review finishes
- block publication until all required reviews are done

## Validation Before Commit

- completed reviews update result readiness
- publication remains blocked for unfinished review sets
- repeated review actions do not corrupt state

## Commit Gate

- one commit only
- suggested message: `feat: add review completion and publication gating`

## Push Rule

- push after the commit only if gating behavior is verified
- stop before Step 7
