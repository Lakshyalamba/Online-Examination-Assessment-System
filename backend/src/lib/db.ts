import { Pool } from "pg";

import { getDatabaseUrl } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __oeasPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = getDatabaseUrl();

  return new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });
}

export const db = globalThis.__oeasPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__oeasPgPool = db;
}
