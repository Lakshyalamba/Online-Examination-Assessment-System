import Link from "next/link";

import { SurfaceCard } from "@/components/ui/shell-primitives";
import { routes } from "@/lib/routes";

const supportCards = [
  {
    title: "Invite activation",
    detail: "First-time users can complete password setup once account activation is enabled.",
  },
  {
    title: "Exam support",
    detail: "Students should confirm browser, network stability, and assigned exam window before starting.",
  },
] as const;

export default function LoginPage() {
  return (
    <SurfaceCard className="login-panel">
      <div className="login-panel__header">
        <p className="surface-card__eyebrow">Sign in</p>
        <h2>Access the examination workspace</h2>
        <p>
          Use institutional credentials for your assigned role. Authentication
          logic is added in the next step, so this form remains presentational
          in this commit.
        </p>
      </div>

      <form className="login-form">
        <div className="form-field">
          <label htmlFor="email">Institutional email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="faculty@college.edu"
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div className="login-form__meta">
          <span>Static shell for Step 3</span>
          <span>Session wiring arrives in Step 4</span>
        </div>

        <div className="login-form__actions">
          <button className="button-link button-link--primary" type="button">
            Sign in
          </button>
          <Link className="button-link button-link--secondary" href={routes.home}>
            Back to landing
          </Link>
        </div>
      </form>

      <div className="login-support-grid">
        {supportCards.map((card) => (
          <div key={card.title} className="login-support-card">
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
