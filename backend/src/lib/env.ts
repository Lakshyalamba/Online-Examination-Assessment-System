function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getRequiredEnv(name: string) {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getAuthSecret() {
  return (
    readEnv("AUTH_SECRET") ??
    readEnv("NEXTAUTH_SECRET") ??
    "oeas-dev-secret"
  );
}

export function getDatabaseUrl() {
  return getRequiredEnv("DATABASE_URL");
}
