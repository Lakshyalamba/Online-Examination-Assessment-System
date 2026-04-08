# Step 6 Prompt

## Objective

Implement section building and question mapping for draft exams.

## Exact Scope For This Prompt

- add sections with order and marks grouping
- map questions into sections
- support question order and marks per exam question
- keep the model ready for `ExamQuestion` snapshots

## Likely Touch Surface

- section builder components
- question mapping UI
- exam-question helper logic

## Validation Before Commit

- sections can be added and ordered
- questions can be mapped and reordered
- marks and order persist correctly

## Commit Gate

- one commit only
- suggested message: `feat: add exam section builder and question mapping`

## Push Rule

- push after the commit only if the draft builder works in the browser
- stop before Step 7
