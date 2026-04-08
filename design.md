# Online Examination Assessment System Design Direction

## 1. Product UX Philosophy

The application should feel modern, academic, trustworthy, and operationally clear.

It is not a flashy consumer product. It is a focused examination system where confidence, readability, and workflow clarity matter more than visual novelty.

Core UX principles:

- professional and institution-friendly
- minimal, but never visually empty
- strong hierarchy for time, status, and next actions
- calm surfaces with deliberate accents
- dashboard clarity over decorative density
- accessible states and predictable interaction patterns
- exam-taking screens must reduce distraction and cognitive load

The product should look like a serious education operations platform, not a generic template dashboard and not a futuristic concept UI.

## 2. Visual Design System

### 2.1 Design Tone

- institutional but contemporary
- clean and structured
- calm, measured, and data-friendly
- suitable for long-form reading, forms, tables, and timed tasks

### 2.2 Color Direction

#### Core Palette

- primary ink: `#102A43`
- primary navy: `#1F4F82`
- accent teal: `#0F766E`
- soft sky surface: `#F5F8FC`
- panel tint: `#EAF1F7`
- border slate: `#D5DFEA`
- body text: `#0F172A`
- muted text: `#475569`
- white surface: `#FFFFFF`

#### Semantic Colors

- success: `#15803D`
- warning: `#B45309`
- danger: `#B42318`
- info: `#0369A1`

#### Usage Rules

- navy is the primary trust color for navigation, headlines, and critical structure
- teal is the controlled accent for active states, progress, filters, and key highlights
- amber is reserved for exam urgency, warnings, and pending review
- red is reserved for destructive actions and blocking errors
- backgrounds stay light and calm; avoid dark heavy canvases for the primary experience

### 2.3 Typography

- heading font: `Manrope`
- body font: `IBM Plex Sans`
- monospace utility font: `IBM Plex Mono`

#### Hierarchy

- display / hero: 40 to 48, weight 700
- page title: 28 to 32, weight 700
- section title: 20 to 24, weight 700
- card title: 16 to 18, weight 600
- body: 14 to 16, weight 400 to 500
- caption / metadata: 12 to 13, weight 500
- timer / exam codes: monospace, 14 to 18, weight 600

### 2.4 Spacing Rules

Use a 4-point scale with common steps:

- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Preferred spacing behavior:

- compact inside dense tables
- medium spacing inside forms and cards
- generous page spacing for dashboard composition

### 2.5 Radius Rules

- page-level panels: 20
- cards and modals: 16
- inputs and selects: 12
- buttons: 12
- chips and badges: pill or 999

### 2.6 Shadows And Surfaces

- use soft layered shadows, not dramatic floating cards
- most surfaces rely more on border definition than shadow
- exam-taking surface should feel stable and quiet, with fewer decorative elevations

### 2.7 Icon Style

- stroke-based icons
- rounded corners
- medium visual weight
- avoid novelty icon packs or overfilled icons

### 2.8 Layout Rhythm

- 12-column desktop structure
- 8-column tablet
- 4-column mobile
- content widths should feel measured, not stretched
- dashboards can use mixed card grids with one prominent primary panel and supporting secondary panels

### 2.9 Theme Preference

- light theme is the primary supported experience
- dark theme is optional future work and should not drive current design decisions

## 3. Component System Direction

### Buttons

- primary buttons use navy or teal fill with white text
- secondary buttons use white or tinted surface with clear border
- destructive buttons use semantic danger color only when action is truly destructive
- disabled buttons remain visibly inactive without becoming illegible

### Inputs

- medium height, soft radius, clear border
- label always visible above the field for dense forms
- helper text and error text sit below the field
- active state uses teal or navy ring, not neon glow

### Selects

- same height and border treatment as inputs
- filters in table toolbars should align cleanly in rows

### Textareas

- used for instructions, long answers, feedback, and explanations
- line height must support long-form text comfortably

### Tabs

- tabs should feel structural, not decorative
- use in exam detail, result detail, and analytics pages
- active tab should be obvious with understated color and strong type

### Tables

- default choice for user management, question bank, audit logs, and results
- rows should be easy to scan with fixed visual rhythm
- status badges should sit cleanly inside cells
- actions should group at far right with predictable density

### Cards

- primary surface pattern across dashboards
- combine metric cards, summary cards, and list cards
- cards should have clear title, metadata line, and action zone

### Modals

- used for confirmations, quick create flows, and destructive actions
- submit confirmation modal for exams must prioritize unanswered-count awareness

### Drawers

- useful for record detail preview without navigating away
- good fit for user detail, question preview, and audit metadata

### Badges

- use consistent status mapping across modules
- keep badge language stable:
  - Draft
  - Scheduled
  - Active
  - Closed
  - Pending Review
  - Ready
  - Published

### Alerts

- inline alerts for validation and eligibility constraints
- top-level alerts for blocked exam actions or result publication issues

### Breadcrumbs

- required for deep admin and examiner pages
- unnecessary on focused student exam attempt page

### Sidebars

- fixed left sidebar on desktop for authenticated areas
- collapsed icon rail option on narrower laptop widths
- mobile should switch sidebar to drawer

### Top Navigation

- compact height
- page title and contextual actions
- right side reserved for user menu and small status utilities

### Pagination

- consistent footer pattern on tables
- keep page-size options modest

### Toasts

- small, calm, informative
- use for save success, publish success, and non-blocking notices
- avoid relying on toasts for critical exam-state warnings

### Empty States

- must explain what is missing and what action the role can take next
- use restrained illustration or icon support only

### Loading States

- use skeletons for dense dashboards and lists
- use inline status chips for autosave and background grading updates

### Error States

- clear title
- plain-language explanation
- retry or recovery path where possible
- never trap student exam screens in ambiguous silent failure states

## 4. Role-Based Dashboard Direction

### Admin Dashboard

- operational overview first
- user counts, active exams, pending reviews, audit activity, and role distribution
- prioritize governance signals over academic detail

### Examiner Dashboard

- focus on authored content and grading workload
- show draft exams, upcoming exams, pending reviews, question bank health, and exam analytics

### Student Dashboard

- focus on next action
- upcoming or active assigned exams appear at the top
- published result summaries appear below
- use stronger urgency language for time-sensitive items

## 5. Page-By-Page UI Direction

### 5.1 Landing Page

Purpose:

- explain the platform quickly for evaluators, faculty, and demo audiences

Layout:

- hero section with headline, subtext, primary sign-in CTA, and product preview panel
- feature grid for question bank, timed exams, grading, analytics, and auditability
- role cards for Admin, Examiner, Student
- short workflow strip showing create, attempt, review, publish
- footer with team and project context

Tone:

- polished and credible
- not marketing-heavy

### 5.2 Login Page

Purpose:

- provide a calm, secure entry point

Layout:

- centered or split-panel layout
- sign-in form on one side
- trust panel on the other with project summary, role hints, and secure exam messaging

### 5.3 Invite / Account Activation Flow

Purpose:

- support first-time password setup for invited users if this flow is included

Layout:

- focused card layout
- steps for identity confirmation, password creation, and success state

### 5.4 Student Dashboard

Purpose:

- surface upcoming exams, active deadlines, and published results

Layout:

- top hero summary with next exam or active exam notice
- quick metrics row: assigned, upcoming, completed, published results
- exam list card
- recent result summaries
- announcements or important instructions panel

### 5.5 Exam Listing Page

Purpose:

- help students scan exam availability and status

Layout:

- page header with filters by status
- list or table showing exam title, window, duration, status, and action
- action state examples:
  - Start
  - Continue
  - Locked
  - Submitted

### 5.6 Exam Attempt Page

Purpose:

- provide distraction-controlled exam-taking experience

Layout:

- sticky top exam bar with title, timer, autosave state, and submit button
- two-column desktop layout:
  - main question area
  - question navigation panel
- main question area includes question number, type badge, prompt, response control, and previous/next controls
- question navigation panel shows answer status, marked-for-review state, and section labels if sections exist

Behavior:

- timer must always remain visible
- autosave state must be easy to understand
- danger and warning states become more visible as expiry approaches

### 5.7 Question Navigation Panel

Purpose:

- let students move across questions without losing state

Layout:

- numbered chips grouped by section if relevant
- visual states:
  - unanswered
  - answered
  - current
  - marked for review

### 5.8 Exam Submit Confirmation Flow

Purpose:

- prevent accidental final submission

Layout:

- modal with unanswered-count summary
- clear warning that submission is final
- actions: return to exam, confirm submit

### 5.9 Result Page

Purpose:

- show published performance clearly and calmly

Layout:

- score summary hero with status badge
- breakdown cards for objective, subjective, total, percentage
- section-wise or question-wise breakdown tabs
- feedback panel for subjective review comments

### 5.10 Examiner Dashboard

Purpose:

- show authoring workload and review responsibilities

Layout:

- metrics for draft exams, scheduled exams, pending reviews, published results
- upcoming exams timeline
- quick access cards for question bank and create exam
- analytics summary strip

### 5.11 Question Bank Page

Purpose:

- manage reusable questions efficiently

Layout:

- filter toolbar with topic, difficulty, and question type
- searchable table
- quick preview drawer
- create/edit form flow with option editor for objective questions

### 5.12 Create Exam Page

Purpose:

- guide exam authoring in a structured way

Layout:

- multi-section page or stepper flow:
  - basic details
  - sections and questions
  - assignments
  - review and publish
- persistent summary sidebar for duration, marks, and assignment count

### 5.13 Edit Exam Page

Purpose:

- allow safe updates to draft or future exams

Layout:

- same core structure as create exam
- explicit status notices when some fields are locked by exam state

### 5.14 Exam Detail Page

Purpose:

- central operational view for an authored exam

Layout:

- overview header
- tabs:
  - Overview
  - Questions
  - Assignments
  - Attempts
  - Results
- summary metrics and activity timeline

### 5.15 Grading / Review Page

Purpose:

- make subjective review fast and accurate

Layout:

- split view:
  - left: question, rubric/model answer, student answer
  - right: marks form, comments, navigation between submissions
- header shows exam, student, and progress in review queue

### 5.16 Admin Dashboard

Purpose:

- give high-level operational visibility

Layout:

- top metrics row
- user-role distribution
- recent audit activity
- pending review or system bottleneck panels

### 5.17 User Management Page

Purpose:

- support account administration with clarity and control

Layout:

- searchable table
- filters by role and status
- create-user button
- detail drawer or modal for updates

### 5.18 Audit Log Page

Purpose:

- provide transparent review of sensitive system actions

Layout:

- dense table with filters for actor, action, entity, and date range
- expandable metadata drawer

### 5.19 Analytics / Report Page

Purpose:

- show exam performance and operational trends

Layout:

- page header with exam selector or range filter
- summary KPI cards
- chart row for score distribution and completion rates
- lower table for question-level performance or result exports

### 5.20 Shared Profile / Settings Page

Purpose:

- allow users to update safe account preferences and review profile data

Layout:

- simple form sections
- role-aware read-only fields where necessary

### 5.21 404 And Error Pages

Purpose:

- keep failure states professional and recoverable

Layout:

- concise message
- navigation back to safe area
- no novelty illustrations that weaken trust

## 6. Responsive Behavior

- desktop is the primary layout target for dense operational screens
- tablet should preserve dashboard readability with stacked panels and collapsible sidebars
- mobile must still support major flows, especially login, dashboard access, and result viewing

### Exam-Taking Interface Responsiveness

- on desktop, keep question area and navigation panel visible together
- on tablet, navigation panel may collapse into a side drawer
- on mobile, keep one-question focus with sticky timer and submit action
- show question navigation through bottom sheet or drawer on small screens
- if the viewport is extremely small, show a polite recommendation for larger-screen use without blocking access unless the institution later decides otherwise

## 7. Accessibility Expectations

- all interactive elements must be keyboard reachable
- focus states must be clearly visible
- contrast ratios must stay strong for text, badges, and status surfaces
- forms must use semantic labels and explicit error messaging
- status should never rely on color alone
- screen structure should use semantic headings and landmarks
- timer warnings must be readable and not purely animated
- autosave feedback must be text-supported
- modals must trap focus correctly and return focus on close

## 8. UI Consistency Rules

- use the same role shell pattern across authenticated areas
- keep page headers consistent: title, short description, actions on the right
- use stable badge language and colors across modules
- use one shared table style, not a new table pattern per page
- keep forms label-first and vertically aligned for readability
- do not introduce decorative gradients or bright accent colors outside the agreed palette
- preserve spacing rhythm and radius system
- keep chart colors muted and readable
- use the same empty, loading, and error state vocabulary across pages

## 9. Handoff Notes For Implementers

- use [`spec.md`](/Users/yashkumar/Online-Examination-Assessment-System/spec.md) for business logic, states, roles, entities, and validation rules
- use [`design.md`](/Users/yashkumar/Online-Examination-Assessment-System/design.md) for visual and UX consistency decisions
- use the markdown files in [`diagrams/`](/Users/yashkumar/Online-Examination-Assessment-System/diagrams) to preserve architecture and workflow alignment
- use the prompt and image assets in [`inspo/`](/Users/yashkumar/Online-Examination-Assessment-System/inspo) as inspiration, not as pixel-perfect requirements
- when a design conflict appears, preserve workflow clarity and shared system rules over one-off visual experimentation
