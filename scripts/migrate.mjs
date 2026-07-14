import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;
const root = process.cwd();

async function loadEnvFile(filename) {
  let contents;
  try {
    contents = await readFile(path.join(root, filename), "utf8");
  } catch {
    return;
  }

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

await loadEnvFile(".env.local");
await loadEnvFile(".env.production.local");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

function withoutTransactionBoundary(sql) {
  return sql.replace(/^\s*BEGIN;\s*/i, "").replace(/\s*COMMIT;\s*$/i, "");
}

async function relationExists(name) {
  const result = await client.query("SELECT to_regclass($1) IS NOT NULL AS exists", [
    `public.${name}`,
  ]);
  return result.rows[0].exists;
}

async function bootstrapExistingDatabase() {
  const baselines = [
    ["001_initial_schema.sql", "orders"],
    ["002_bom_tables.sql", "bom_components"],
    ["003_products_table.sql", "admin_products"],
    ["004_accessories.sql", "accessories"],
  ];

  for (const [version, relation] of baselines) {
    if (!(await relationExists(relation))) continue;
    await client.query(
      `INSERT INTO schema_migrations (version, checksum, execution_source)
       VALUES ($1, 'baseline-existing-schema', 'bootstrap')
       ON CONFLICT (version) DO NOTHING`,
      [version],
    );
  }
}

await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      execution_source TEXT NOT NULL DEFAULT 'runner'
    )
  `);
  await bootstrapExistingDatabase();

  const migrationsDir = path.join(root, "db", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((name) => /^\d+_.+\.sql$/.test(name))
    .sort((a, b) => a.localeCompare(b));

  const appliedRows = await client.query("SELECT version, checksum FROM schema_migrations");
  const applied = new Map(appliedRows.rows.map((row) => [row.version, row.checksum]));

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const previousChecksum = applied.get(file);

    if (previousChecksum) {
      if (previousChecksum !== "baseline-existing-schema" && previousChecksum !== checksum) {
        throw new Error(`Applied migration ${file} has changed since execution.`);
      }
      console.log(`skip ${file}`);
      continue;
    }

    console.log(`apply ${file}`);
    await client.query("BEGIN");
    try {
      await client.query(withoutTransactionBoundary(sql));
      await client.query("INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)", [
        file,
        checksum,
      ]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  await client.end();
}
