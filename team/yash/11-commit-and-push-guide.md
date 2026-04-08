# Commit And Push Guide

Use this guide across all Yash prompts.

- one numbered prompt should usually produce one commit
- do not start the next prompt before making the current prompt’s commit
- keep auth, RBAC, shell, and fallback-state commits separate
- write commit messages around capability, not file names
- push after each stable step commit so the history reflects prompt-by-prompt progress
- if a step changes a shared contract, mention that in the commit message and handoff note
- avoid cleanup-only commits unless they are the explicit goal of Step 8
