export type AppRole = "ADMIN" | "EXAMINER" | "STUDENT";

export type AccountStatus = "ACTIVE" | "INACTIVE";

export type AuthUserRecord = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: AccountStatus;
  passwordHash: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  isActive: true;
};

export type UserRegistrationInput = {
  name: string;
  email: string;
  password: string;
};
