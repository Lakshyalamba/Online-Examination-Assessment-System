# Step 2 Prompt

## Objective

Build the assigned exam listing and status-aware action model.

## Exact Scope For This Prompt

- list assigned exams
- show status labels such as Start, Continue, Locked, and Submitted
- expose clear action entry points

## Validation Before Commit

- list states map correctly to exam and attempt status
- empty and locked states are readable

## Commit Gate

- one commit only
- suggested message: `feat: add assigned exam list and status actions`

## Push Rule

- push after the commit only if the exam list is browser-checked
- stop before Step 3
