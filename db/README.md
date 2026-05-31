# Database — ArcVane Studio

## Overview

ArcVane uses PostgreSQL with versioned SQL migrations and stored procedures/functions. There is no ORM. Application code interacts with the database exclusively through the typed contracts layer (`server/db/contracts.ts`), which calls stored procedures.

## Prerequisites

- PostgreSQL 13+ (required for `gen_random_uuid()`)
- A database created for the project (e.g. `ArcVane`)
- `DATABASE_URL` environment variable set (see `.env.example`)

## Running Migrations

Migrations are plain SQL files in `db/migrations/` and must be run in order.

```bash
# Against a fresh database:
psql $DATABASE_URL -f db/migrations/001_initial_schema.sql
psql $DATABASE_URL -f db/migrations/002_bom_tables.sql
psql $DATABASE_URL -f db/migrations/003_products_table.sql
```

## Installing Stored Procedures

Procedure files are in `db/procedures/` and must be run after the migrations:

```bash
psql $DATABASE_URL -f db/procedures/order_procedures.sql
psql $DATABASE_URL -f db/procedures/auth_procedures.sql
psql $DATABASE_URL -f db/procedures/pickup_procedures.sql
psql $DATABASE_URL -f db/procedures/bom_procedures.sql
psql $DATABASE_URL -f db/procedures/product_procedures.sql
```

To re-run procedures (e.g. after editing): all functions use `CREATE OR REPLACE FUNCTION`, so re-running is safe and idempotent.

## Full Setup (single command)

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/ArcVane"

psql $DATABASE_URL -f db/migrations/001_initial_schema.sql \
  && psql $DATABASE_URL -f db/migrations/002_bom_tables.sql \
  && psql $DATABASE_URL -f db/migrations/003_products_table.sql \
  && psql $DATABASE_URL -f db/procedures/order_procedures.sql \
  && psql $DATABASE_URL -f db/procedures/auth_procedures.sql \
  && psql $DATABASE_URL -f db/procedures/pickup_procedures.sql \
  && psql $DATABASE_URL -f db/procedures/bom_procedures.sql \
  && psql $DATABASE_URL -f db/procedures/product_procedures.sql
```

The package scripts mirror this order:

```bash
pnpm db:migrate
pnpm db:procedures
```

Do not run setup commands against production until `DATABASE_URL` has been checked and a provider-level backup or export has been taken.

## Tables

| Table                    | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| `users`                  | Auth.js-compatible user records            |
| `accounts`               | OAuth provider account links               |
| `sessions`               | Active sessions                            |
| `verification_tokens`    | Email verification / magic link tokens     |
| `orders`                 | Order records created from Stripe checkout |
| `order_items`            | Individual line items within an order      |
| `stripe_events`          | Raw Stripe webhook event log (idempotency) |
| `pickup_requests`        | Customer pickup scheduling                 |
| `buyer_events`           | Analytics / hook event log                 |
| `shipping_stubs`         | Placeholder for future shipping support    |
| `custom_design_requests` | Custom design inquiry submissions          |
| `bom_components`         | Admin-lite bill-of-materials components    |
| `bom_lines`              | Product-to-component bill-of-material rows |
| `admin_products`         | Admin-lite product catalogue rows          |

## Operational Data Notes

Live `admin_products` rows are operational catalogue data. Export or back up those rows before any destructive database work, reset, or environment rebuild. The current repository setup creates the product table and procedures, but it does not seed or restore live product rows.

Provider-managed schemas such as Neon `neon_auth` are not owned by this application setup path and should not be modified by these scripts.

## Stored Procedures / Functions

### Order Procedures (`order_procedures.sql`)

| Function                                | Description                                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `create_order_from_stripe_session(...)` | Creates order from Stripe session data. Idempotent — returns existing order if session ID already exists. |
| `create_order_item(...)`                | Inserts a single order item with adapter, notes, and metadata.                                            |
| `record_stripe_event(...)`              | Records raw Stripe webhook payload. Idempotent by event ID.                                               |
| `mark_stripe_event_processed(...)`      | Marks a Stripe event as processed.                                                                        |
| `record_buyer_event(...)`               | Records a buyer analytics event.                                                                          |
| `get_order_by_id(...)`                  | Returns order with items as JSON array.                                                                   |
| `get_orders_for_email(...)`             | Returns paginated order list for an email.                                                                |
| `get_recent_orders_admin(...)`          | Returns paginated recent orders for admin view with optional status filter.                               |
| `create_custom_design_request(...)`     | Inserts a custom design request.                                                                          |

### Auth Procedures (`auth_procedures.sql`)

| Function                         | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `create_user(...)`               | Creates or upserts a user by email.                   |
| `get_user_by_id(...)`            | Retrieves user by UUID.                               |
| `get_user_by_email(...)`         | Retrieves user by email.                              |
| `update_user(...)`               | Partial update of user fields.                        |
| `delete_user(...)`               | Deletes user (cascades to accounts/sessions).         |
| `link_account(...)`              | Links an OAuth provider account. Upserts on conflict. |
| `create_session(...)`            | Creates a new session.                                |
| `get_session_and_user(...)`      | Retrieves session with joined user data.              |
| `delete_session(...)`            | Deletes a session by token.                           |
| `create_verification_token(...)` | Creates a verification/magic-link token.              |
| `use_verification_token(...)`    | Consumes (deletes) a verification token.              |

### Pickup Procedures (`pickup_procedures.sql`)

| Function                             | Description                                                               |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `create_pickup_request(...)`         | Creates a pickup request for an order.                                    |
| `update_pickup_status(...)`          | Updates pickup status on order and latest request. Validates status enum. |
| `get_pickup_requests_for_order(...)` | Returns all pickup requests for an order.                                 |
| `get_orders_pending_pickup(...)`     | Returns orders awaiting pickup (admin view).                              |

### BOM Procedures (`bom_procedures.sql`)

| Function                       | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `upsert_bom_component(...)`    | Creates or updates a BOM component.                       |
| `delete_bom_component(...)`    | Deletes an unused BOM component.                          |
| `list_bom_components(...)`     | Returns BOM components for admin-lite views.              |
| `upsert_bom_line(...)`         | Creates or updates a product BOM line.                    |
| `delete_bom_line(...)`         | Deletes a product BOM line.                               |
| `get_product_bom(...)`         | Returns component-expanded BOM lines for a product.       |

### Product Procedures (`product_procedures.sql`)

| Function                           | Description                                              |
| ---------------------------------- | -------------------------------------------------------- |
| `list_admin_products(...)`         | Returns admin-lite product catalogue rows.               |
| `get_admin_product(...)`           | Retrieves a product by id.                               |
| `get_admin_product_by_handle(...)` | Retrieves a product by URL handle.                       |
| `upsert_admin_product(...)`        | Creates or updates an admin-lite catalogue product.      |
| `append_admin_product_image(...)`  | Adds an image URL to a product image list.               |
| `delete_admin_product(...)`        | Deletes an admin-lite catalogue product.                 |
| `toggle_admin_product_stock(...)`  | Updates product stock visibility for admin-lite flows.   |

## Metadata Fields (Future-Ready)

The `order_items.metadata` JSONB column is designed to carry future-ready fields without schema changes:

- `market_event_id` — links item to a market/fair event
- `market_source` — source attribution (e.g. "sunday_market_2024")
- `qr_campaign` — QR code campaign identifier
- `display_sample_id` — physical display sample reference
- `production_queue_status` — print queue tracking
- `filament_material` — specific filament material used
- `filament_colour` — specific filament colour used
- `print_profile` — slicer profile reference

## Architecture Notes

- **No ORM**: All database access uses parameterised SQL via `pg` (node-postgres).
- **Contracts layer**: `server/db/contracts.ts` exports typed functions that call stored procedures. Route handlers call these, never raw SQL.
- **Idempotency**: Webhook-facing procedures (`create_order_from_stripe_session`, `record_stripe_event`) are idempotent to handle Stripe webhook replay safely.
- **Indexes**: Key columns are indexed for performance (Stripe session ID, email, user ID, status fields, created_at).

## Rollback and Destructive Operations

Schema resets, table truncation, and other destructive database operations are not part of routine setup. For live Neon environments, use provider-native backups, point-in-time restore, or a reviewed rollback plan instead of ad hoc reset SQL.

If a disposable local database needs to be recreated, confirm it contains no operational data, rebuild it outside production, and then re-run migrations and procedures in the order above. Never reset a production database that contains operational product, order, or customer data.
