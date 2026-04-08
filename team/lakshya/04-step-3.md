# Step 3 Prompt

## Objective

Implement exam-start eligibility checks and attempt bootstrap behavior.

## Exact Scope For This Prompt

- start exam action
- eligibility messaging for blocked starts
- attempt bootstrap and question-session loading

## Validation Before Commit

- eligible exams can be entered
- blocked cases show clear messages
- active attempts resume through the correct path

## Commit Gate

- one commit only
- suggested message: `feat: add exam start eligibility and attempt bootstrap`

## Push Rule

- push after the commit only if start and blocked flows are browser-tested
- stop before Step 4
