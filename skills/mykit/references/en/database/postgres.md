# PostgreSQL

## Rules
- Use explicit schema and migrations for every structural change.
- Prefer normalized design and add indexes based on query patterns.
- Keep transactions around multi-step consistency updates.

## Do
- Use parameterized queries and explicit transaction boundaries.

## Don't
- Run ad-hoc schema changes directly in production DB consoles.

## Example
```ts
await db.transaction(async (tx) => {
  const user = await tx.user.create({ data: input });
  await tx.auditLog.create({ data: { userId: user.id, action: "created" } });
});
```

## Boundaries
- Migration layer owns schema evolution.
- Repository layer owns SQL/query mapping.
- Service layer decides transaction scope.

## Test Scope
- Migration up/down validation in staging.
- Query plan/index checks for critical endpoints.
