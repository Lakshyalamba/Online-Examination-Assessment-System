import { compare, hash } from "bcryptjs";

import { db } from "../../lib/db";
import type {
  AuthUserRecord,
  SessionUser,
  UserRegistrationInput,
} from "./types";

export type CredentialValidationResult =
  | {
      success: true;
      user: SessionUser;
    }
  | {
      success: false;
      reason:
        | "invalid_credentials"
        | "inactive_account"
        | "service_unavailable";
    };

export type UserRegistrationResult =
  | {
      success: true;
      user: SessionUser;
    }
  | {
      success: false;
      reason: "email_in_use" | "service_unavailable";
    };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapUserToSessionUser(user: AuthUserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: true,
  };
}

function isDuplicateEmailError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const normalizedEmail = normalizeEmail(email);

  try {
  const result = await db.query<AuthUserRecord>(
    `
      select
        id,
        name,
        email,
        role,
        status,
        password_hash as "passwordHash"
      from users
      where lower(email) = $1
      limit 1
    `,
    [normalizedEmail],
  );

  return result.rows[0] ?? null;
  } catch (error) {
    console.error("Unable to query user by email.", error);
    return null;
  }
}

export async function validateCredentials(
  email: string,
  password: string,
): Promise<CredentialValidationResult> {
  let user: AuthUserRecord | null;

  try {
    const normalizedEmail = normalizeEmail(email);

    const result = await db.query<AuthUserRecord>(
      `
        select
          id,
          name,
          email,
          role,
          status,
          password_hash as "passwordHash"
        from users
        where lower(email) = $1
        limit 1
      `,
      [normalizedEmail],
    );

    user = result.rows[0] ?? null;
  } catch (error) {
    console.error("Unable to validate credentials.", error);
    return { success: false, reason: "service_unavailable" };
  }

  if (!user) {
    return { success: false, reason: "invalid_credentials" };
  }

  if (user.status !== "ACTIVE") {
    return { success: false, reason: "inactive_account" };
  }

  const isPasswordValid = await compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return { success: false, reason: "invalid_credentials" };
  }

  return {
    success: true,
    user: mapUserToSessionUser(user),
  };
}

export async function registerStudent(
  input: UserRegistrationInput,
): Promise<UserRegistrationResult> {
  try {
    const normalizedEmail = normalizeEmail(input.email);
    const passwordHash = await hash(input.password, 10);

    const result = await db.query<AuthUserRecord>(
      `
        insert into users (name, email, role, status, password_hash)
        values ($1, $2, 'STUDENT', 'ACTIVE', $3)
        returning
          id,
          name,
          email,
          role,
          status,
          password_hash as "passwordHash"
      `,
      [input.name.trim(), normalizedEmail, passwordHash],
    );

    return {
      success: true,
      user: mapUserToSessionUser(result.rows[0]),
    };
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return { success: false, reason: "email_in_use" };
    }

    console.error("Unable to register student account.", error);
    return { success: false, reason: "service_unavailable" };
  }
}
