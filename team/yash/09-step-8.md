# Step 8 Prompt

## Objective

Do the final foundation polish pass so the shared app shell is reliable for the rest of the team.

## Exact Scope For This Prompt

- fix shell responsiveness issues
- improve accessibility details in shared navigation and auth screens
- clean up duplicate layout code
- stabilize any rough edges discovered in Steps 1 through 7

## Likely Touch Surface

- shared layout files
- auth pages
- navigation components
- global style utilities

## Do Not Touch In This Prompt

- ownership areas that belong to later feature modules
- broad refactors unrelated to foundation quality

## Validation Before Commit

- desktop and mobile shell behavior is stable
- focus states and keyboard reachability are acceptable
- no broken shared routes or obvious layout regressions remain

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `chore: polish shared foundation and responsive shell behavior`

## Push Rule

- push after the commit only if the shell is stable enough for other teammates to build on
- stop after the push and then run the full personal validation file before declaring the slice complete
