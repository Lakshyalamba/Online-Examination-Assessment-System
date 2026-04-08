# Step 3 Prompt

## Objective

Implement create-user and role-status update flows.

## Exact Scope For This Prompt

- create or invite user flow
- role update controls
- active or inactive status update controls

## Validation Before Commit

- users can be created
- role and status updates work
- invalid role or duplicate-email errors are clear

## Commit Gate

- one commit only
- suggested message: `feat: add user creation and role status management`

## Push Rule

- push after the commit only if create and update flows are browser-tested
- stop before Step 4
