# Team Execution Guide

## Working Model

This team scaffold now assumes a strict execution pattern:

- each teammate works through `8` numbered implementation prompts
- each numbered prompt should produce `1` clean, reviewable commit
- each prompt must be finished, validated, committed, and then stopped before starting the next prompt
- the expected outcome is `8` core commits per teammate, with small optional fix commits only if a prompt genuinely needs follow-up

This solves the coordination problem of giving prompts one by one. The prompt itself now contains the scope boundary, validation gate, commit instruction, and push rule for that exact step.

## Shared Rule Before Any Coding

Everyone must read:

- [`README.md`](/Users/yashkumar/Online-Examination-Assessment-System/README.md)
- [`spec.md`](/Users/yashkumar/Online-Examination-Assessment-System/spec.md)
- [`design.md`](/Users/yashkumar/Online-Examination-Assessment-System/design.md)
- relevant files in [`diagrams/`](/Users/yashkumar/Online-Examination-Assessment-System/diagrams)
- relevant prompts and generated images in [`inspo/`](/Users/yashkumar/Online-Examination-Assessment-System/inspo)

## Ownership Split

| Teammate | Primary ownership | Main modules and pages |
| --- | --- | --- |
| Yash | foundations, auth, RBAC, shared shell, role-aware dashboard scaffolding | `auth`, shared layout, navigation, protected routes, dashboard shells, global states |
| Rakshita | examiner authoring flow | `questions`, `exams`, question bank page, create/edit exam pages, exam detail page |
| Lakshya | student attempt flow | `attempts`, student dashboard, exam list, exam attempt UI, submit flow |
| Ravleen | evaluation and result lifecycle | `evaluation`, `results`, grading workspace, result pages, publication states |
| Abhishek | admin operations and observability | `users`, `reports`, `audit`, admin dashboard, user management, audit logs, analytics |

## One-Prompt-At-A-Time Rule

For every teammate folder:

- `00-read-first.md` explains the shared documents that must be read before any implementation
- `01-role-and-scope.md` defines ownership, boundaries, dependencies, and the 8-step commit map
- `02` through `09` are the actual implementation prompts
- `10-validation-and-browser-checks.md` is the final regression pass for the whole slice
- `11-commit-and-push-guide.md` is the global discipline rule for the branch
- `12-done-checklist.md` is the final completion gate

Do not skip ahead. The correct operating order is:

1. read the shared docs
2. read personal scope
3. execute exactly one numbered step prompt
4. validate only that step
5. make the step commit
6. push the branch after the commit if the step is stable
7. stop and wait before starting the next prompt

## How To Keep Consistency

- use the exact role names, entity names, and status labels defined in `spec.md`
- use the page and component direction in `design.md`
- keep modules aligned to the architecture in `spec.md`
- use the diagram pack as the visual check against drift in entity relationships and workflow order
- keep UI patterns consistent instead of creating one-off page-specific component styles

## How To Avoid Overlap

- Yash owns auth, route protection, shared shells, and dashboard skeletons
- Rakshita owns question bank and exam authoring pages
- Lakshya owns student-facing attempt flow
- Ravleen owns grading and result flow
- Abhishek owns admin, audit, and analytics surfaces

If a file clearly belongs to another teammate’s area, do not quietly rewrite it. Coordinate first.

## Commit And Push Expectations

- every numbered step should end with one small logical commit
- commit only after the prompt-local validation instructions pass
- push after each completed prompt if the branch is in a stable state
- do not batch multiple numbered prompts into one large commit
- if a step turns out too large, split within the step only if absolutely necessary and keep the history readable

## Integration Guidance

1. Land Yash’s foundation steps first so the route structure and shared shell are stable.
2. Then run Rakshita, Lakshya, Ravleen, and Abhishek in parallel by numbered prompts.
3. Prefer integrating after each numbered prompt instead of waiting for an entire slice to finish.
4. If a prompt changes a shared contract, document that in the commit and tell affected teammates before they start their next prompt.

## Handoff Expectations

When a numbered prompt is complete:

- state which prompt file was executed
- state which files were changed
- state which checks were run
- provide the commit message used
- mention whether the branch was pushed

When the full slice is complete:

- run the full personal validation file
- update any shared docs if behavior changed
- use the done checklist before handing off for integration
