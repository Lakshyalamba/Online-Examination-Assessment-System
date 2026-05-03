"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PublicShell } from "@/components/layout/public-shell";
import { SurfaceCard } from "@/components/ui/shell-primitives";
import { routes } from "@oeas/backend/lib/routes";

const heroMetrics = [
  { label: "Question formats", value: "5", detail: "Objective and descriptive patterns" },
  { label: "Core roles", value: "3", detail: "Admin, Examiner, Student" },
  { label: "Exam lifecycle", value: "4", detail: "Create, attempt, review, publish" },
] as const;

const featureCards = [
  { eyebrow: "Question bank", title: "Reuse structured academic content" },
  { eyebrow: "Timed exams", title: "Run exam windows with operational clarity" },
  { eyebrow: "Grading", title: "Blend objective scoring with manual review" },
  { eyebrow: "Analytics", title: "Track readiness, workload, and outcomes" },
  { eyebrow: "Auditability", title: "Keep sensitive actions visible" },
] as const;

const roleCards = [
  { role: "Admin", actions: ["Manage users", "Review audit logs", "Monitor activity"] },
  { role: "Examiner", actions: ["Build question banks", "Schedule assessments", "Review submissions"] },
  { role: "Student", actions: ["See assigned exams", "Complete timed attempts", "Check published results"] },
] as const;

const workflowSteps = [
  { step: "Create" },
  { step: "Attempt" },
  { step: "Review" },
  { step: "Publish" },
] as const;

const footerItems = [
  "TypeScript + Next.js modular monolith",
  "Role-aware academic operations platform",
  "Prepared for team-based module implementation",
] as const;

const fadeInTransition = {
  duration: 0.6,
  ease: "easeOut",
} as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: fadeInTransition }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  return (
    <PublicShell>
      <section className="landing-hero" style={{ display: "flex", flexDirection: "column", gap: "48px", alignItems: "center", textAlign: "center", paddingTop: "40px" }}>
        <motion.div 
          className="landing-hero__copy" 
          style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="landing-kicker">Serious assessment infrastructure for colleges</motion.p>
          <motion.h2 variants={fadeInUp} className="landing-display" style={{ fontSize: "2.75rem", lineHeight: 1.15, margin: "32px auto", textAlign: "center", width: "100%" }}>
            Role-aware examination operations.
          </motion.h2>
          <motion.div variants={fadeInUp} className="landing-actions" style={{ justifyContent: "center", marginBottom: "48px" }}>
            <Link className="button-link button-link--primary" href={routes.login} style={{ padding: "12px 32px", fontSize: "1.125rem" }}>
              Sign in to continue
            </Link>
            <a className="button-link button-link--secondary" href="#platform-flow" style={{ padding: "12px 32px", fontSize: "1.125rem" }}>
              View workflow
            </a>
          </motion.div>
          
          <motion.div variants={fadeInUp} style={{ width: "100%", maxWidth: "1000px", margin: "0 auto 48px auto", borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.15)" }}>
            <Image
              src="/hero-dashboard.png"
              alt="Platform Dashboard Preview"
              width={1600}
              height={900}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>

          <motion.div variants={staggerContainer} className="landing-metrics" aria-label="Platform overview" style={{ justifyContent: "center" }}>
            {heroMetrics.map((item) => (
              <motion.div variants={fadeInUp} key={item.label} className="landing-metric">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <motion.section 
        className="landing-section" 
        aria-labelledby="feature-grid-heading" id="features"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
      >
        <div className="section-heading">
          <p className="shell-eyebrow">Platform capabilities</p>
          <h2 id="feature-grid-heading">Built for operationally clear assessment delivery</h2>
        </div>
        <motion.div className="feature-grid" variants={staggerContainer}>
          {featureCards.map((item) => (
            <motion.div key={item.title} variants={fadeInUp}>
              <SurfaceCard className="feature-card">
                <p className="surface-card__eyebrow">{item.eyebrow}</p>
                <div className="surface-card__copy">
                  <h3>{item.title}</h3>
                </div>
              </SurfaceCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section 
        className="landing-section" 
        aria-labelledby="role-grid-heading"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
      >
        <div className="section-heading">
          <p className="shell-eyebrow">Role-based access</p>
          <h2 id="role-grid-heading">One platform, three clear operating perspectives</h2>
        </div>
        <motion.div className="role-grid" variants={staggerContainer}>
          {roleCards.map((item) => (
            <motion.div key={item.role} variants={fadeInUp}>
              <SurfaceCard className="role-card">
                <div className="role-card__header">
                  <h3>{item.role}</h3>
                  <span className="role-card__badge">{item.role}</span>
                </div>
                <ul className="surface-card__list">
                  {item.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </SurfaceCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
      >
        <SurfaceCard as="section" className="workflow-board" tone="tint" padding="compact" id="platform-flow">
          <div className="section-heading section-heading--compact">
            <p className="shell-eyebrow">Platform flow</p>
            <h2>Create, attempt, review, and publish with one shared structure</h2>
          </div>
          <motion.div className="workflow-strip" variants={staggerContainer}>
            {workflowSteps.map((item, index) => (
              <motion.div key={item.step} className="workflow-step" variants={fadeInUp}>
                <div className="workflow-step__index">{`0${index + 1}`}</div>
                <div className="workflow-step__copy">
                  <h3>{item.step}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SurfaceCard>
      </motion.div>

      <motion.footer 
        className="landing-footer"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      >
        <div className="landing-footer__copy">
          <p className="shell-eyebrow">Project context</p>
          <h2>Shared scaffold for a five-member implementation team</h2>
        </div>
        <div className="landing-footer__meta">
          <ul className="surface-card__list">
            {footerItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="landing-footer__team">
            Team: Yash, Rakshita, Lakshya, Ravleen, Abhishek
          </p>
        </div>
      </motion.footer>
    </PublicShell>
  );
}
