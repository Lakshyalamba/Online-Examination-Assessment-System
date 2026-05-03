"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, signOut } from "../../auth";
import { getDashboardRouteForRole } from "../../lib/auth/rbac";
import { routes } from "../../lib/routes";
import {
  initialLoginFormState,
  initialSignupFormState,
  type LoginFormState,
  type SignupFormState,
} from "./login-form-state";
import { registerStudent, validateCredentials } from "./service";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Institutional email is required.")
    .email("Enter a valid institutional email."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Institutional email is required.")
      .email("Enter a valid institutional email."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function loginWithCredentials(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: {
        email: parsed.error.flatten().fieldErrors.email?.[0],
        password: parsed.error.flatten().fieldErrors.password?.[0],
      },
      fields: {
        email: String(formData.get("email") ?? ""),
      },
    };
  }

  const result = await validateCredentials(parsed.data.email, parsed.data.password);

  if (!result.success) {
    if (result.reason === "service_unavailable") {
      return {
        status: "error",
        message:
          "Authentication is temporarily unavailable. Check the database configuration and try again.",
        fields: {
          email: parsed.data.email,
        },
      };
    }

    if (result.reason === "inactive_account") {
      return {
        status: "error",
        message:
          "This account is inactive. Contact an administrator before trying again.",
        fields: {
          email: parsed.data.email,
        },
      };
    }

    return {
      status: "error",
      message: "Invalid email or password.",
      fields: {
        email: parsed.data.email,
      },
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: getDashboardRouteForRole(result.user.role),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message: "Unable to start a session. Try again.",
        fields: {
          email: parsed.data.email,
        },
      };
    }

    throw error;
  }

  return initialLoginFormState;
}

export async function registerStudentAccount(
  _previousState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: {
        name: parsed.error.flatten().fieldErrors.name?.[0],
        email: parsed.error.flatten().fieldErrors.email?.[0],
        password: parsed.error.flatten().fieldErrors.password?.[0],
        confirmPassword: parsed.error.flatten().fieldErrors.confirmPassword?.[0],
      },
      fields: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
    };
  }

  const result = await registerStudent({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.success) {
    if (result.reason === "email_in_use") {
      return {
        status: "error",
        message: "An account with that email already exists. Sign in instead.",
        fields: {
          name: parsed.data.name,
          email: parsed.data.email,
        },
      };
    }

    return {
      status: "error",
      message:
        "Registration is temporarily unavailable. Check the database configuration and try again.",
      fields: {
        name: parsed.data.name,
        email: parsed.data.email,
      },
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: getDashboardRouteForRole(result.user.role),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "success",
        message:
          "Account created. Sign in with your new credentials from the login tab.",
        fields: {
          email: parsed.data.email,
        },
      };
    }

    throw error;
  }

  return initialSignupFormState;
}

export async function logoutUser() {
  await signOut({
    redirectTo: routes.login,
  });
}
