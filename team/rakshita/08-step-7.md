# Step 7 Prompt

## Objective

Implement student assignment and publish-readiness enforcement.

## Exact Scope For This Prompt

- assign students to an exam
- block duplicate or invalid assignments
- enforce publish-readiness checks for questions, schedule, and assignments
- expose exam status clearly

## Likely Touch Surface

- assignment components
- publish controls
- readiness summary or validation banner

## Validation Before Commit

- valid students can be assigned
- invalid assignments are blocked
- publish fails cleanly when readiness conditions are not met

## Commit Gate

- one commit only
- suggested message: `feat: add exam assignment and publish readiness checks`

## Push Rule

- push after the commit only if assignment and publish checks are browser-tested
- stop before Step 8
