# Performance

## Rules
- Optimize only when cost is real.
- Avoid memoization for trivial calculations.
- Never issue a DB call inside a loop, once per item. If the call count scales with the data count (N+1), batch it into one query.

## Do
- Measure first, optimize second.
- Batch per-item DB calls into a single batched/joined query.

## Don't
- Add caching/memoization preemptively.
- Await a DB call per loop iteration when a single batched query would do.

## Do Example
```ts
const sum = a + b; // no useMemo for trivial work
```

```ts
// ✅ one batched query
const ids = profiles.map((p) => p.id);
const users = await getUsersByIds(ids);
```

## Don't Example
```ts
const sum = useMemo(() => a + b, [a, b]);
```

```ts
// ❌ N+1: one request per item
for (const profile of profiles) {
  const user = await getUserById(profile.id);
}
```

## Boundaries
- Performance tuning belongs to measured hotspots.
- Readability wins when costs are negligible.

## Test Scope
- Track baseline and after metrics.
- Verify no behavior regressions from optimization.
