# Step 4 Prompt

## Objective

Implement editing, preview, and subjective question support.

## Exact Scope For This Prompt

- edit existing questions
- preview question detail
- support `SHORT_TEXT` and `LONG_TEXT`
- keep question reuse practical and readable

## Likely Touch Surface

- edit-question page
- preview drawer or panel
- subjective form controls

## Validation Before Commit

- subjective questions can be created and edited
- previews reflect saved structure accurately
- edit flow does not break objective question rules

## Commit Gate

- one commit only
- suggested message: `feat: add question editing preview and subjective support`

## Push Rule

- push after the commit only if create and edit flows are both stable
- stop before Step 5
