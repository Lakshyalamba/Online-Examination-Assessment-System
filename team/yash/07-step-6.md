# Step 6 Prompt

## Objective

Add role-aware navigation maps and dashboard entry scaffolds that other teammates will extend.

## Exact Scope For This Prompt

- build sidebar navigation by role
- build top header and breadcrumb baseline
- add dashboard entry pages for Admin, Examiner, and Student
- expose stable navigation destinations for downstream feature work

## Likely Touch Surface

- `src/components/layout/`
- dashboard home pages
- navigation config files

## Do Not Touch In This Prompt

- feature-specific internals for exams, attempts, results, or admin data

## Validation Before Commit

- each role sees the correct navigation items
- dashboard entry pages exist for all roles
- shell structure remains consistent across roles

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add role-aware navigation and dashboard entry pages`

## Push Rule

- push after the commit only if all role dashboards are browser-checked
- stop after the push and wait before starting Step 7
