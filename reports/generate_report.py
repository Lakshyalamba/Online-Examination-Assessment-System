from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Online-Examination-Assessment-System-Report.pdf"


def build_story():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCenter",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#10243f"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubtitleCenter",
            parent=styles["Normal"],
            alignment=TA_CENTER,
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#10243f"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=14,
            textColor=colors.HexColor("#1f3b66"),
            spaceBefore=6,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            leftIndent=12,
            firstLineIndent=0,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallNote",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#4b5563"),
            alignment=TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ContributionName",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#10243f"),
            spaceBefore=6,
            spaceAfter=2,
        )
    )

    story = []

    story.append(Spacer(1, 1.0 * inch))
    story.append(Paragraph("Online Examination Assessment System", styles["TitleCenter"]))
    story.append(Paragraph("Detailed Project Report", styles["TitleCenter"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(
        Paragraph(
            "Prepared from the current repository state for viva and project presentation use.",
            styles["SubtitleCenter"],
        )
    )
    story.append(
        Paragraph(
            "This report summarizes the website, its architecture, major user journeys, database-backed auth flow, visual diagrams, and teammate contributions derived from commit history.",
            styles["SubtitleCenter"],
        )
    )
    story.append(Spacer(1, 0.55 * inch))

    info = [
        ["Project type", "Full stack online examination and assessment platform"],
        ["Primary workflow", "Exam creation, student attempt, grading, and result review"],
        ["Frontend", "Next.js application with dashboard and public site"],
        ["Backend", "Shared backend modules for auth, routing, and persistence"],
        ["Database", "PostgreSQL via Neon"],
    ]
    table = Table(info, colWidths=[1.65 * inch, 4.9 * inch], hAlign="CENTER")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eff6ff")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dbe4ef")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.2),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#111827")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.35 * inch))
    story.append(
        Paragraph(
            "The report is intentionally written in report style rather than commit log style. It focuses on the system as a product, then closes with equal contribution summaries for each teammate.",
            styles["SmallNote"],
        )
    )
    story.append(PageBreak())

    sections = [
        (
            "1. Project Overview",
            [
                "The Online Examination Assessment System is a role-based web application for managing the full lifecycle of online exams. It supports public landing pages, authenticated access, role-aware dashboards, question authoring, exam assembly, timed student attempts, grading, results, and audit-related operations.",
                "The design goal of the project is operational clarity: each role sees only the controls and data they need, while the underlying services keep the exam state consistent and predictable. The application is not a marketing site; it is an operational assessment platform built for repeated use by administrators, examiners, and students.",
            ],
        ),
        (
            "2. Website Structure and User Experience",
            [
                "The public side of the website introduces the platform with a hero section, a summary of capabilities, role cards, workflow highlights, and a visible team footer. The landing page is meant to explain the product quickly and to give new users a clear path into sign-in or role-based usage.",
                "Authentication is handled through a dedicated login and signup flow. The interface supports credential-based access and a student registration path, while role guards control where a user can go after login. This prevents users from landing in pages that do not match their role.",
                "The dashboard side uses a shared shell with a sidebar, topbar, and content surface. The shell gives each role a consistent frame for navigation, while the pages inside it focus on domain work such as question management, exam creation, student attempts, user administration, and results review.",
            ],
        ),
        (
            "3. Core Functional Areas",
            [
                "Public and authentication flow: the site provides landing, login, signup, and session handling. The authentication layer persists real users in Postgres and maps the authenticated identity into role-aware access.",
                "Question bank and exam authoring: examiners can create objective questions, edit drafts, define sections, attach questions to exams, and check readiness before publishing.",
                "Student assessment flow: students can discover assigned exams, open an attempt, navigate through questions, autosave answers, submit manually, or finish through timeout handling. The runtime is designed to preserve attempt state rather than treat the exam as a one-shot form.",
                "Results and review flow: objective grading can be resolved automatically, while subjective or pending items move through a review workspace. Final results are aggregated only after readiness checks are satisfied.",
                "Administration and reporting: admin-oriented pages cover user management, audit logs, result visibility, and reporting views so the system can be operated rather than just used.",
            ],
        ),
        (
            "4. Architecture and Implementation Style",
            [
                "The codebase uses a layered structure. The UI calls route handlers or server actions, those call service functions, and the services talk to the database or auth provider. This keeps the route files small and makes the business rules easier to test.",
                "A shared database pool is used for persistence, and the auth flow is adapted through NextAuth credentials integration. The services use narrow interfaces and typed payloads so each function depends only on the data it really needs.",
                "Validation is schema-first. Question and auth inputs are defined through typed contracts, which reduces mismatch between forms, API handlers, and domain logic. The same approach is used to separate ready, draft, pending review, and published result states.",
            ],
        ),
        (
            "5. Diagram Summary",
            [
                "Use case diagram: shows the three main actors, Admin, Examiner, and Student, and the actions each one can perform. It is the quickest way to understand the permission model of the system.",
                "Class diagram: shows the static model of the application, including users, exams, attempts, questions, options, results, and supporting service or repository abstractions.",
                "Sequence diagrams: show the runtime behavior of student attempts and exam creation. They are useful for explaining how a request moves through authentication, validation, persistence, and state transitions.",
                "ER diagram: shows the database relationships among users, questions, exams, attempts, answers, results, and review entities. It explains why the application can track lifecycle state rather than only final scores.",
                "Activity diagram: presents the exam lifecycle from login and eligibility checks through attempt creation, autosave, submission, grading, and publishing.",
            ],
        ),
        (
            "6. Technical Outcome",
            [
                "The application is structured to be deployable on modern hosting platforms and to keep data and authentication real rather than mocked. The move to database-backed users and the role-based routing model make the project closer to a production assessment tool than a static demo.",
                "The codebase also favors reusable UI primitives and shells so the public site and the dashboard remain visually consistent. This matters because the system contains several different operational screens, but they still need a single design language.",
            ],
        ),
    ]

    for title, paragraphs in sections:
        story.append(Paragraph(title, styles["SectionHeading"]))
        for text in paragraphs:
            story.append(Paragraph(text, styles["Body"]))
        story.append(Spacer(1, 0.08 * inch))

    story.append(PageBreak())
    story.append(Paragraph("Contribution Summary", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "The contribution section is intentionally placed at the end, and every teammate is described at the same level of detail.",
            styles["Body"],
        )
    )

    contributions = [
        (
            "Yash Kumar",
            "Worked on the repo structure, shared UI shell, public landing and login experience, credentials-based auth flow, role guards, Vercel readiness, and later auth rendering and signup fixes. The commit history shows this work focused on the application foundation and the user-facing experience that ties the project together.",
        ),
        (
            "Lakshyalamba",
            "Shaped the initial platform direction and the assessment persistence layer, then extended that base with student attempt flows, exam discovery, question and exam management, and result-related work. The commit history also includes the normalization of diagram assets, which helped the documentation and presentation side of the project stay organized.",
        ),
        (
            "Rakshita",
            "Focused on question authoring and exam-building workflows, including validation contracts, question bank features, objective question creation, draft exam metadata, scheduling, section assembly, assignment checks, and publish readiness. This contribution is centered on turning the examination model into a structured authoring experience.",
        ),
        (
            "Ravleen Singh",
            "Built the evaluation and result side of the platform, including grading strategies, result aggregation, readiness transitions, pending review work, marks entry, publication gating, and examiner result overview flows. This work is what turns submitted attempts into managed outcomes instead of isolated records.",
        ),
        (
            "Abhishek Rana",
            "Developed the administrative side of the system through user listing, user creation and role management, audit logs, and reporting pages with chart and detail views. This contribution gives the platform operational visibility and makes it usable for staff-level oversight.",
        ),
    ]

    for name, text in contributions:
        story.append(Paragraph(name, styles["ContributionName"]))
        story.append(Paragraph(text, styles["Body"]))

    story.append(Spacer(1, 0.1 * inch))
    story.append(
        Paragraph(
            "Overall, the project is built as a collaborative assessment platform with distinct role ownership, shared infrastructure, and a single deployment surface. The commit history shows a balanced distribution of product, workflow, and operations work across the team.",
            styles["Body"],
        )
    )

    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawRightString(
        A4[0] - 18 * mm,
        10 * mm,
        f"Page {canvas.getPageNumber()}",
    )
    canvas.drawString(18 * mm, 10 * mm, "Online Examination Assessment System")
    canvas.restoreState()


def main():
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Online Examination Assessment System Report",
        author="Codex",
        subject="Detailed project report",
        creator="ReportLab",
    )
    doc.build(build_story(), onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
