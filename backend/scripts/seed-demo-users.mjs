import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import pg from "pg";

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: join(__dirname, "../../frontend/.env.local"), override: false });
loadEnv({ path: join(__dirname, "../../frontend/.env"), override: false });
loadEnv({ path: join(__dirname, "../.env.local"), override: false });
loadEnv({ path: join(__dirname, "../.env"), override: false });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sharedDemoPasswordHash =
  "$2b$10$vrDadlT5U74biZ9Dk.xGi.Hm/uBdRtU1mjTmoYuGhZdtonSPC2Awm";

const users = [
  {
    name: "Aarav Sharma",
    email: "admin@oeas.local",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    name: "Meera Verma",
    email: "examiner@oeas.local",
    role: "EXAMINER",
    status: "ACTIVE",
  },
  {
    name: "Rohan Gupta",
    email: "student@oeas.local",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    name: "Priya Nair",
    email: "inactive.student@oeas.local",
    role: "STUDENT",
    status: "INACTIVE",
  },
];

const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  await client.connect();

  for (const user of users) {
    await client.query(
      `
        insert into users (name, email, role, status, password_hash)
        values ($1, $2, $3, $4, $5)
        on conflict (email) do update
        set
          name = excluded.name,
          role = excluded.role,
          status = excluded.status,
          password_hash = excluded.password_hash
      `,
      [
        user.name,
        user.email,
        user.role,
        user.status,
        sharedDemoPasswordHash,
      ],
    );
  }

  console.log("Seeded demo users.");
  console.log("Shared demo password: OeasDemo@123");
} finally {
  await client.end();
}
