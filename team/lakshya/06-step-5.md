# Step 5 Prompt

## Objective

Implement answer controls and question navigation.

## Exact Scope For This Prompt

- render supported answer input controls
- add previous and next navigation
- add marked-for-review support
- add question navigation panel or drawer

## Validation Before Commit

- answers can be entered across supported question types
- navigation does not lose local answer state
- marked-for-review state is visible

## Commit Gate

- one commit only
- suggested message: `feat: add answer controls and question navigation`

## Push Rule

- push after the commit only if navigation and input behavior are browser-tested
- stop before Step 6
