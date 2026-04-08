# Step 3 Prompt

## Objective

Implement result aggregation and readiness transitions after submission.

## Exact Scope For This Prompt

- combine objective and subjective score paths
- move results to `PENDING_REVIEW` or `READY`
- keep attempt and result states aligned

## Validation Before Commit

- objective-only exams become ready
- mixed exams remain pending until review
- aggregation does not double-count scores

## Commit Gate

- one commit only
- suggested message: `feat: add result aggregation and readiness transitions`

## Push Rule

- push after the commit only if readiness transitions are verified
- stop before Step 4
