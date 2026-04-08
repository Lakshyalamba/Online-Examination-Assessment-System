# Validation And Browser Checks

Run this after Step 8 and before calling Yash’s slice complete.

## Automated And Local Checks

- run available linting and automated tests
- verify the application builds or starts cleanly
- confirm auth-related utilities and protected layouts compile without warnings

## Browser Checks

- check the landing page and login page
- test login and logout flows
- test direct URL access into protected routes while unauthenticated
- test role-based redirects after login
- test navigation visibility for Admin, Examiner, and Student
- test not-found and error states

## Final History Check

- confirm there are `8` meaningful step commits on the branch for this slice
- confirm each commit corresponds to one numbered prompt
- confirm no numbered prompt was silently merged into another
