# Step 4 Prompt

## Objective

Build the audit log listing page.

## Exact Scope For This Prompt

- audit table layout
- event rows with actor, action, entity, and timestamp
- practical no-data state

## Validation Before Commit

- audit entries render correctly
- table density remains readable
- page stays admin-only

## Commit Gate

- one commit only
- suggested message: `feat: add audit log listing page`

## Push Rule

- push after the commit only if the audit page is browser-checked
- stop before Step 5
