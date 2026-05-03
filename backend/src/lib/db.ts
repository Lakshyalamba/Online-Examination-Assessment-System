import { Pool, type QueryResultRow } from "pg";

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

export function getDb() {
  if (!globalThis.__oeasPgPool) {
    globalThis.__oeasPgPool = createPool();
  }

  return globalThis.__oeasPgPool;
}

export async function dbQuery<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return getDb().query<T>(text, params);
}

export const db = {
  query: dbQuery,
};
