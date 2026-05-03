"use client";

import { useActionState } from "react";

import { registerStudentAccount } from "../actions";
import { initialSignupFormState } from "../login-form-state";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      className="button-link button-link--primary"
      type="submit"
      disabled={pending}
    >
      {pending ? "Creating account..." : "Create student account"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    registerStudentAccount,
    initialSignupFormState,
  );

  return (
    <form className="login-form" action={formAction}>
      <div className="form-field">
        <label htmlFor="signup-name">Full name</label>
        <input
          id="signup-name"
          name="name"
          type="text"
          placeholder="Rohan Gupta"
          autoComplete="name"
          required
          defaultValue={state.fields?.name ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "signup-name-error" : undefined}
        />
        {state.fieldErrors?.name ? (
          <p className="form-field__error" id="signup-name-error">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor="signup-email">Institutional email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="student@college.edu"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="email"
          required
          spellCheck={false}
          defaultValue={state.fields?.email ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "signup-email-error" : undefined}
        />
        {state.fieldErrors?.email ? (
          <p className="form-field__error" id="signup-email-error">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={state.fieldErrors?.password ? "signup-password-error" : undefined}
        />
        {state.fieldErrors?.password ? (
          <p className="form-field__error" id="signup-password-error">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor="signup-confirm-password">Confirm password</label>
        <input
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "signup-confirm-password-error"
              : undefined
          }
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="form-field__error" id="signup-confirm-password-error">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className="form-alert"
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <div className="login-form__meta">
        <span>Student self-registration</span>
        <span>Admin and examiner accounts are provisioned separately</span>
      </div>

      <div className="login-form__actions">
        <SubmitButton pending={pending} />
      </div>
    </form>
  );
}
