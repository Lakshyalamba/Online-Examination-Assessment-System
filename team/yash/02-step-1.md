# Step 1 Prompt

## Objective

Create the route-group skeleton and public/auth entry structure so all later work has a stable application frame.

## Exact Scope For This Prompt

- create public, auth, and dashboard route groups
- create minimal placeholder pages where needed
- create the top-level folder structure for shared layout and UI modules
- do not implement full auth logic yet

## Likely Touch Surface

- `src/app/(public)/`
- `src/app/(auth)/`
- `src/app/(dashboard)/`
- `src/components/layout/`
- `src/components/ui/`

## Do Not Touch In This Prompt

- role logic details
- login submission logic
- dashboard-specific feature pages owned by others

## Validation Before Commit

- app boots without route errors
- public and auth routes render
- dashboard route group exists structurally

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add route groups and application entry structure`

## Push Rule

- push after the commit only if the app boots and the route skeleton is stable
- stop after the push and do not start Step 2 in the same implementation pass
