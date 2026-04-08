# Step 6 Prompt

## Objective

Implement autosave and attempt recovery behavior.

## Exact Scope For This Prompt

- autosave trigger logic
- saved, saving, and failed indicators
- refresh or re-entry recovery for active attempts

## Validation Before Commit

- answers persist reliably
- autosave states are clear
- refresh does not destroy active attempt progress

## Commit Gate

- one commit only
- suggested message: `feat: add autosave and attempt recovery flow`

## Push Rule

- push after the commit only if autosave and refresh behavior are tested
- stop before Step 7
