# Step 1 Prompt

## Objective

Create the question-authoring foundation before building visible CRUD pages.

## Exact Scope For This Prompt

- define question types, difficulty enums, and topic shape
- define validation schemas for all supported question types
- add shared authoring helpers that later forms can reuse

## Likely Touch Surface

- `src/modules/questions/`
- shared validation files
- question-domain utility files

## Validation Before Commit

- schemas cover all supported types
- malformed option sets are rejected
- type names match `spec.md`

## Commit Gate

- one commit only
- suggested message: `feat: add question authoring contracts and validation`

## Push Rule

- push after the commit only if the shared question contracts are stable
- stop before Step 2
