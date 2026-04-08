# Step 5 Prompt

## Objective

Implement RBAC enforcement and role-aware redirect behavior.

## Exact Scope For This Prompt

- add route guards or middleware
- enforce Admin, Examiner, and Student access boundaries
- redirect authenticated users to the correct dashboard by role
- handle unauthorized route access cleanly

## Likely Touch Surface

- route middleware or guard layer
- auth policy helpers
- protected layouts

## Do Not Touch In This Prompt

- dashboard content pages beyond basic redirect targets
- feature-specific authorization rules inside other modules

## Validation Before Commit

- unauthenticated users are blocked from protected routes
- authenticated users cannot access other-role routes
- redirects are correct for all three roles

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add role-based route guards and redirects`

## Push Rule

- push after the commit only if direct URL access tests pass for all roles
- stop after the push and wait before starting Step 6
