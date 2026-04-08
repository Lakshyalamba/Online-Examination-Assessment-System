# Step 8 Prompt

## Objective

Finish the examiner authoring slice with the exam detail page and polish pass.

## Exact Scope For This Prompt

- build examiner exam detail view
- add overview, questions, assignments, and downstream-ready tabs
- polish authoring UI consistency and edge states

## Likely Touch Surface

- exam detail page
- tab structures
- shared authoring presentation components

## Validation Before Commit

- authored exam detail pages load correctly
- tabs reflect saved authoring data
- authoring flow remains visually consistent end to end

## Commit Gate

- one commit only
- suggested message: `feat: add examiner exam detail page and authoring polish`

## Push Rule

- push after the commit only if the end-to-end authoring path is stable
- stop and then run the full personal validation file
