# MySQL

## Rules
- Keep charset/collation consistent (`utf8mb4`) across tables.
- Use foreign keys intentionally and document cascade behavior.
- Prefer deterministic pagination (`id` or indexed cursor).

## Do
- Validate query plans with `EXPLAIN` for high-traffic queries.

## Don't
- Depend on implicit ordering without `ORDER BY`.

## Example
```ts
const rows = await db.query(
  "SELECT id, email FROM users WHERE status = ? ORDER BY id DESC LIMIT ?",
  ["active", 50],
);
```

## Boundaries
- DBA/schema layer owns collation/index policy.
- Repository owns SQL compatibility and mapping.
- Service owns business filtering semantics.

## Test Scope
- Collation and encoding correctness tests.
- Pagination consistency under concurrent inserts.
