# Online Examination Assessment System

This repository is the master planning scaffold for a college System Design Project focused on building a role-based Online Examination Assessment System with TypeScript and Next.js.

The goal is not to ship the production application from this repository state. The goal is to give a five-member team a clean, shared, implementation-ready source of truth covering product scope, architecture, design direction, diagram definitions, visual inspiration, and execution prompts for AI-assisted development.

## Why This Is a Strong System Design Project

An online examination platform is a practical system design problem because it combines:

- role-based access control across Admin, Examiner, and Student users
- structured domain modeling for exams, questions, attempts, results, and audit trails
- time-sensitive workflows such as exam scheduling, attempt windows, autosave, and submission deadlines
- mixed evaluation logic with objective auto-grading and subjective manual review
- operational concerns such as result publication, analytics, observability basics, and clean failure handling
- maintainable architecture decisions that demonstrate OOP, SOLID, design patterns, UML thinking, and SDLC discipline

## Team

- Yash
- Rakshita
- Lakshya
- Ravleen
- Abhishek

## Stack Direction

- Primary language: TypeScript
- Frontend framework: Next.js
- Architecture style: modular monolith with clear domain and service boundaries
- Data layer: PostgreSQL + Prisma
- Auth direction: Auth.js with role-aware session protection
- Validation: Zod
- Styling direction: design-system-driven dashboard UI for responsive web

## Repository Purpose

This repository exists to align the team before implementation starts. It establishes:

- product scope and realistic boundaries
- architecture and module definitions
- shared UI and UX direction
- UML and system-design diagram source files in markdown
- UI inspiration prompts and generated references
- balanced ownership for all five teammates
- reusable, detailed AI prompts for each teammate’s implementation steps

## Repository Map

### [`spec.md`](/Users/yashkumar/Online-Examination-Assessment-System/spec.md)

The implementation-grade product and engineering specification. This is the main system definition for features, workflows, architecture, entities, validations, security, testing, delivery phases, and definition of done.

### [`design.md`](/Users/yashkumar/Online-Examination-Assessment-System/design.md)

The main UI and UX direction document. This defines the product’s visual identity, design system rules, role dashboards, page-by-page layout expectations, responsive behavior, and accessibility standards.

### [`diagrams/`](/Users/yashkumar/Online-Examination-Assessment-System/diagrams)

Markdown source files for the required UML and system design diagrams. These files are intentionally written so the team can later recreate polished visuals manually in Figma or another diagramming tool without losing architectural intent.

### [`inspo/`](/Users/yashkumar/Online-Examination-Assessment-System/inspo)

The visual direction library. It contains inspiration prompts, generated reference images, and organization notes for pages and shared component patterns. These are alignment assets, not final UI requirements.

### [`team/`](/Users/yashkumar/Online-Examination-Assessment-System/team)

The execution layer for the five-member group. Each teammate gets a scoped folder with read-first instructions, role boundaries, implementation-step prompts, validation guidance, commit guidance, and a done checklist.

## How To Use This Scaffold

1. Read [`README.md`](/Users/yashkumar/Online-Examination-Assessment-System/README.md), [`spec.md`](/Users/yashkumar/Online-Examination-Assessment-System/spec.md), and [`design.md`](/Users/yashkumar/Online-Examination-Assessment-System/design.md) before writing code.
2. Review the relevant diagram files in [`diagrams/`](/Users/yashkumar/Online-Examination-Assessment-System/diagrams) so domain models, workflows, and architecture stay consistent.
3. Review the reference prompts and images in [`inspo/`](/Users/yashkumar/Online-Examination-Assessment-System/inspo) before implementing layouts or shared components.
4. Each teammate should then work from their own folder in [`team/`](/Users/yashkumar/Online-Examination-Assessment-System/team), staying within ownership boundaries and shared contracts.
5. Integrate in small increments, validate locally, test affected flows in a browser, and avoid introducing schema or interface changes without updating the shared docs.

## Short Implementation Roadmap

1. Foundations: project setup, folder structure, auth, RBAC, shared layout, role-aware navigation, core schema.
2. Authoring: question bank, question types, exam creation, scheduling, assignments, examiner dashboards.
3. Exam engine: student dashboard, eligibility checks, timed attempt flow, autosave, submission handling.
4. Evaluation: objective grading, manual review workflow, result aggregation, publication states, result views.
5. Operations: admin dashboard, user management, audit logs, analytics, reporting, polish, testing, and final documentation.

## Important Diagram Note

All files in [`diagrams/`](/Users/yashkumar/Online-Examination-Assessment-System/diagrams) are markdown source definitions, not final visual assets. They are meant to be manually recreated as polished diagrams later. The markdown must remain the authoritative description of what those diagrams should contain.
