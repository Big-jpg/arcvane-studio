// server/db/client.ts
// ArcVane Studio — PostgreSQL connection pool and query helper.
// Uses the `pg` package (node-postgres). No ORM.

import { Pool, QueryResult, QueryResultRow } from "pg";

// ---------------------------------------------------------------------------
// Connection Pool
// ---------------------------------------------------------------------------

// Neon (and most managed PostgreSQL providers) require SSL.
// The DATABASE_URL typically includes ?sslmode=require, but we also set ssl
// explicitly to ensure the pg driver enables it regardless of URL params.
const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL ?? "";
const requiresSsl = databaseUrl.includes("neon.tech") || databaseUrl.includes("sslmode=require") || isProduction;

const pool = new Pool({
  connectionString: databaseUrl,
  // Sensible defaults for a serverless-friendly deployment (Vercel, etc.)
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

// ---------------------------------------------------------------------------
// Query Helper
// ---------------------------------------------------------------------------

/**
 * Execute a parameterised SQL query against the connection pool.
 * All application code should use this helper (or the contracts layer)
 * rather than acquiring pool clients directly.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Execute a query and return only the rows array.
 * Convenience wrapper for SELECT-style queries.
 */
export async function queryRows<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

/**
 * Execute a query and return the first row, or null if no rows returned.
 * Useful for single-record lookups and INSERT...RETURNING.
 */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const result = await pool.query<T>(text, params);
  return result.rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Pool lifecycle (for graceful shutdown in non-serverless environments)
// ---------------------------------------------------------------------------

export async function closePool(): Promise<void> {
  await pool.end();
}

export { pool };
