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

function withoutTransactionBoundary(sql) {
  return sql.replace(/^\s*BEGIN;\s*/i, "").replace(/\s*COMMIT;\s*$/i, "");
}

await loadEnvFile(".env.local");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
await client.query("BEGIN");

try {
  const migration = await readFile(
    path.join(root, "db", "migrations", "005_catalogue_v2.sql"),
    "utf8",
  );
  await client.query(withoutTransactionBoundary(migration));

  for (const file of [
    "product_procedures.sql",
    "catalogue_v2_procedures.sql",
    "order_procedures.sql",
  ]) {
    await client.query(await readFile(path.join(root, "db", "procedures", file), "utf8"));
  }

  const counts = (
    await client.query(`
    SELECT
      (SELECT count(*)::int FROM admin_products) AS products,
      (SELECT count(*)::int FROM product_variants WHERE archived_at IS NULL) AS variants,
      (SELECT count(*)::int FROM product_media WHERE archived_at IS NULL) AS media,
      (SELECT count(*)::int FROM order_items) AS order_items
  `)
  ).rows[0];
  const payload = (await client.query("SELECT list_catalogue_products_v2(true) AS product LIMIT 1"))
    .rows[0]?.product;
  const sales = (await client.query("SELECT get_sales_summary() AS summary")).rows[0]?.summary;

  if (!payload?.variants || !payload?.media)
    throw new Error("Catalogue payload did not include variants and media.");
  if (!sales || !Array.isArray(sales.products))
    throw new Error("Sales summary contract is invalid.");

  console.log(
    JSON.stringify(
      { validation: "ok", rollbackOnly: true, counts, sampleProduct: payload.handle, sales },
      null,
      2,
    ),
  );
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
