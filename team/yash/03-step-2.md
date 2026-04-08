# Step 2 Prompt

## Objective

Add the design-token and shell-primitives layer that all internal pages will reuse.

## Exact Scope For This Prompt

- add core color, spacing, radius, and typography tokens
- add shell primitives such as content canvas, page container, and surface card
- align the visual baseline with `design.md`

## Likely Touch Surface

- global styles
- theme token files
- `src/components/ui/`
- `src/components/layout/`

## Do Not Touch In This Prompt

- auth submission logic
- route-guard logic
- role-specific page behavior

## Validation Before Commit

- shared primitives render consistently
- shell surfaces match the agreed palette and spacing
- no token naming drifts from the design direction

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: add shared design tokens and shell primitives`

## Push Rule

- push after the commit only if the shared shell still renders cleanly
- stop after the push and wait before starting Step 3
