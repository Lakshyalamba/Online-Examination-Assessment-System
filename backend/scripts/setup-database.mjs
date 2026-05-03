import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import pg from "pg";

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "../db/schema.sql");

loadEnv({ path: join(__dirname, "../../frontend/.env.local"), override: false });
loadEnv({ path: join(__dirname, "../../frontend/.env"), override: false });
loadEnv({ path: join(__dirname, "../.env.local"), override: false });
loadEnv({ path: join(__dirname, "../.env"), override: false });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  const schemaSql = await readFile(schemaPath, "utf8");
  await client.connect();
  await client.query(schemaSql);
  console.log("Database schema is up to date.");
} finally {
  await client.end();
}
