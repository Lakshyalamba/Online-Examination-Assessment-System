import { compare } from "bcryptjs";

import { db } from "../../lib/db";
import type { AuthUserRecord, SessionUser } from "./types";

export type CredentialValidationResult =
  | {
      success: true;
      user: SessionUser;
    }
  | {
      success: false;
      reason: "invalid_credentials" | "inactive_account";
    };

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();

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
}

export async function validateCredentials(
  email: string,
  password: string,
): Promise<CredentialValidationResult> {
  const user = await findUserByEmail(email);

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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: true,
    },
  };
}
