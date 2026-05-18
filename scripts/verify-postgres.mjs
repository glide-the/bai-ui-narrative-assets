#!/usr/bin/env node
/**
 * Preflight for pnpm db:migrate — catches wrong host port before drizzle-kit ECONNRESET.
 * Root docker-compose.yml maps postgres to localhost:5433 (user/db: nationality).
 */
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const expected =
  process.env.EXPECTED_DATABASE_URL ??
  "postgres://nationality:nationality@localhost:5433/nationality";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "[db] DATABASE_URL is missing. Copy env.local.template to .env.local or set DATABASE_URL."
  );
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error("[db] DATABASE_URL is not a valid URL.");
  process.exit(1);
}

const port = parsed.port || "5432";
if (port === "5432" && parsed.hostname === "localhost") {
  console.warn(
    "[db] WARNING: DATABASE_URL uses localhost:5432. Root docker-compose.yml exposes Postgres on port 5433."
  );
  console.warn(
    "[db] Update .env.local, e.g.: postgres://nationality:nationality@localhost:5433/nationality"
  );
  console.warn("[db] See README.md § 故障排查：pnpm db:migrate 报 ECONNRESET");
}

const client = new pg.Client({ connectionString: url });
try {
  await client.connect();
  await client.query("SELECT 1");
  console.log(`[db] OK: connected to ${parsed.hostname}:${port}/${parsed.pathname.slice(1)}`);
} catch (err) {
  const code = err?.code ?? "unknown";
  console.error(`[db] Connection failed (${code}): ${err.message}`);
  console.error(`[db] Expected for local Docker: ${expected}`);
  console.error("[db] Run: docker compose up -d postgres && docker compose ps postgres");
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
