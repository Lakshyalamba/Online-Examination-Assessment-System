# Role And Scope

You own the implementation foundations for the project.

## What You Own

- app routing structure and protected route strategy
- authentication flow and session wiring
- authorization helpers and role checks
- shared layout shell for authenticated areas
- shared navigation, page header, and dashboard scaffolding
- global loading, empty, error, and not-found baseline states

## What You Do Not Own

- question bank CRUD logic
- exam creation business rules
- student attempt runtime logic
- grading and result logic
- admin user management workflows beyond route access and shell setup

## Dependencies On Other Teammates

- everyone else depends on your route groups, auth context, shared layout patterns, and role-aware navigation
- your work must expose stable shell conventions so others do not create competing dashboard structures

## Expected Deliverable Shape

Your branch should end with `8` main commits, one for each numbered prompt below.

## Eight-Prompt Commit Map

1. route groups and public/auth shell baseline
2. design tokens and shared layout primitives
3. landing page and login page UI shell
4. authentication flow and session plumbing
5. RBAC guards and role redirects
6. role-aware navigation and dashboard entry pages
7. shared page-header, loading, empty, error, and not-found states
8. foundation polish, responsive fixes, and integration cleanup

## Success Criteria

- unauthorized users cannot access restricted routes
- role-aware redirects work
- shared navigation reflects the correct role
- shell and base states match `design.md`
- other teammates can build their modules without rewriting the app structure

## Coordination Notes

- keep shared contracts explicit and central
- avoid burying access rules inside UI components
- do not over-implement feature logic that belongs to later module owners
- if a numbered prompt affects another owner, stop after the commit and communicate before moving forward
