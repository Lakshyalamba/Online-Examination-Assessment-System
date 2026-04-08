# Step 3 Prompt

## Objective

Implement the public landing page and the visual login page shell so the application has polished entry screens before auth wiring is added.

## Exact Scope For This Prompt

- build the landing page layout
- build the login page UI shell
- use the inspiration assets and `design.md` as layout references
- keep forms static if auth actions are not ready yet

## Likely Touch Surface

- `src/app/(public)/page.*`
- `src/app/(auth)/**`
- shared public-layout components

## Do Not Touch In This Prompt

- session creation logic
- middleware
- dashboard navigation logic

## Validation Before Commit

- landing and login screens render cleanly
- visual hierarchy matches the design direction
- responsive behavior works on desktop and mobile widths

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add landing page and login screen layouts`

## Push Rule

- push after the commit only if both entry screens are browser-checked
- stop after the push and wait before starting Step 4
