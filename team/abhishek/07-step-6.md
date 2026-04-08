# Step 6 Prompt

## Objective

Build the KPI summary layer for analytics and reporting.

## Exact Scope For This Prompt

- reporting page frame
- KPI summary cards
- primary filters such as date range or exam selector

## Validation Before Commit

- KPI cards render for realistic data
- filters update the page state
- no-data states remain clean

## Commit Gate

- one commit only
- suggested message: `feat: add analytics kpi summary and filters`

## Push Rule

- push after the commit only if the reporting frame is browser-checked
- stop before Step 7
