# Diagram Source Pack

## Purpose

This folder contains markdown source definitions for the system-design and UML diagrams required by the Online Examination Assessment System project.

These files are meant to do two jobs:

- preserve the architectural truth of the system in a text-reviewable format
- make it easy for a human teammate to recreate polished visual diagrams later in Figma or another diagramming tool

## Mandatory Diagrams

- `01-use-case-diagram.md`
- `02-class-diagram.md`
- `03-sequence-diagram-student-attempt.md`
- `04-sequence-diagram-exam-creation.md`
- `05-er-diagram.md`
- `06-component-diagram.md`
- `07-activity-diagram-exam-flow.md`
- `08-deployment-diagram.md`

## Optional But Recommended Later

- state diagram for exam lifecycle
- state diagram for attempt and result lifecycle
- package or module diagram for the codebase
- wireflow for the student exam-taking experience

## How To Recreate In Figma Later

1. Read the diagram file completely before drawing.
2. Preserve the listed actors, entities, components, and relationships exactly.
3. Use the visual grouping guidance in each file to separate roles, services, domain objects, and infrastructure.
4. Add layout polish in Figma only after the semantic structure is correct.
5. Keep the markdown file as the source of truth. If the visual diagram changes meaningfully, update the markdown too.
