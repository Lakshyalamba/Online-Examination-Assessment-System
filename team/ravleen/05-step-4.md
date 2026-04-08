# Step 4 Prompt

## Objective

Build the pending review queue listing for examiners.

## Exact Scope For This Prompt

- list pending review items
- show exam, student, and review status context
- add filters or queue grouping where useful

## Validation Before Commit

- pending review items render correctly
- empty queue states are clean
- role protection remains intact

## Commit Gate

- one commit only
- suggested message: `feat: add pending review queue listing`

## Push Rule

- push after the commit only if the queue is browser-checked
- stop before Step 5
