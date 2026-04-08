# Step 7 Prompt

## Objective

Implement shared shell utilities and global fallback states.

## Exact Scope For This Prompt

- add reusable page-header and toolbar patterns
- add loading, empty, error, and not-found baseline states
- ensure these states feel consistent with the shared design language

## Likely Touch Surface

- `src/components/layout/`
- `src/components/ui/`
- `src/app/not-found.*`
- global error and loading files

## Do Not Touch In This Prompt

- module-specific business logic
- one-off visual patterns for only one dashboard

## Validation Before Commit

- fallback states render without crashing
- page-header patterns are reusable
- empty and loading states are visually consistent

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add shared shell utilities and global fallback states`

## Push Rule

- push after the commit only if the new shared states are checked in the browser
- stop after the push and wait before starting Step 8
