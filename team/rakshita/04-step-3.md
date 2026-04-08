# Step 3 Prompt

## Objective

Implement the create-question flow for objective question types.

## Exact Scope For This Prompt

- create form for `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, and `TRUE_FALSE`
- add option editing and answer-key selection
- surface validation clearly in the UI

## Likely Touch Surface

- create-question page
- objective question form components
- option editor components

## Validation Before Commit

- all three objective types can be created
- invalid option configurations are blocked
- success and error feedback are clear

## Commit Gate

- one commit only
- suggested message: `feat: add objective question creation flow`

## Push Rule

- push after the commit only if all objective forms are browser-checked
- stop before Step 4
