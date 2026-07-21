# Performance

## Rules
- Optimize only when cost is real.
- Avoid memoization for trivial calculations.

## Do
- Measure first, optimize second.

## Don't
- Add caching/memoization preemptively.

## Do Example
```ts
const sum = a + b; // no useMemo for trivial work
```

## Don't Example
```ts
const sum = useMemo(() => a + b, [a, b]);
```

## Boundaries
- Performance tuning belongs to measured hotspots.
- Readability wins when costs are negligible.

## Test Scope
- Track baseline and after metrics.
- Verify no behavior regressions from optimization.
