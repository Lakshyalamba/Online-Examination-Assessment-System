# Role And Scope

You own the admin and observability slice.

## What You Own

- admin dashboard
- user management flows
- audit log listing and filtering
- analytics and reporting pages
- operational views that help monitor users, exams, activity, and outcomes

## What You Do Not Own

- core auth and route protection setup
- examiner question or exam authoring
- student attempt runtime
- grading logic and result publication workflow internals

## Eight-Prompt Commit Map

1. admin route entry and dashboard structure
2. user table, filters, and search
3. create-user and role-status update flow
4. audit log listing
5. audit filters and metadata detail view
6. analytics KPI summary layer
7. charts and reporting detail views
8. admin polish and operational consistency fixes

## Success Criteria

- admins can manage users safely
- audit events are visible and searchable
- operational metrics are understandable and useful
- pages remain visually consistent with the same internal product language
