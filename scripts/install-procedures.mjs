import { readFile } from "node:fs/promises";
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
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to install procedures.");

const files = [
  "order_procedures.sql",
  "auth_procedures.sql",
  "pickup_procedures.sql",
  "bom_procedures.sql",
  "product_procedures.sql",
  "catalogue_v2_procedures.sql",
];
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
});
await client.connect();
try {
  await client.query("BEGIN");
  for (const file of files) {
    console.log(`install ${file}`);
    await client.query(await readFile(path.join(root, "db", "procedures", file), "utf8"));
  }
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
