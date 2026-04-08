# Step 4 Prompt

## Objective

Implement the actual authentication flow and session plumbing.

## Exact Scope For This Prompt

- wire credentials login
- wire logout
- resolve authenticated session state
- handle invalid credentials and inactive accounts

## Likely Touch Surface

- `src/modules/auth/`
- `src/lib/auth/`
- auth handlers, actions, or config files
- login form wiring

## Do Not Touch In This Prompt

- role-based navigation maps
- dashboard placeholder pages
- feature pages owned by other teammates

## Validation Before Commit

- valid users can log in
- invalid credentials fail cleanly
- inactive users are blocked
- logout clears session state

## Commit Gate

- make one commit when this prompt is complete
- suggested message: `feat: implement credentials auth and session flow`

## Push Rule

- push after the commit only if login and logout have been tested in a browser
- stop after the push and wait before starting Step 5
