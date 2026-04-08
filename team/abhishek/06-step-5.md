# Step 5 Prompt

## Objective

Implement audit filters and metadata detail behavior.

## Exact Scope For This Prompt

- filters for actor, action, entity, and date range
- metadata drawer or detail panel
- clear no-match handling

## Validation Before Commit

- filters narrow results correctly
- metadata detail is readable
- no-match states are clean

## Commit Gate

- one commit only
- suggested message: `feat: add audit log filters and metadata detail view`

## Push Rule

- push after the commit only if filter behavior is browser-tested
- stop before Step 6
