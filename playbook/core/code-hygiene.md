# Code Hygiene

## Rules
- Remove unused imports/exports immediately.
- Do not hide failure with fallback-first coding.
- Keep domain-agnostic pure functions (date/number formatting, etc.) in `utils/` and reuse them.
- Never move logic that's still used in only one place into `utils/` on speculation. Extract it once it's actually needed in 2 or more places.

## Do
- Fix root cause before adding guard rails.
- Check `utils/` for an existing helper before adding a new one.

## Don't
- Silence errors with broad try-catch.
- Never repeat generic logic like date or number formatting inline in every file.
- Never extract logic into `utils/` while it's still only used in one place.

## Do Example
```ts
if (!response.ok) throw new Error("request_failed");
```

```ts
// utils/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US");
}
```

## Don't Example
```ts
try {
  await request();
}
catch {
  // ignore
}
```

```ts
// ❌ the same date-formatting logic is reimplemented in every file
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString("en-US");
}
```

```ts
// ❌ extracted to utils/ while only used in one place
// utils/formatOrderTitle.ts
export function formatOrderTitle(order: Order) {
  return `#${order.id} ${order.title}`;
}
```

## Boundaries
- Error handling belongs where error context exists.
- Fallback behavior must be explicit and reviewed.
- `utils/` holds pure functions with no domain knowledge. If domain rules or API calls creep in, it belongs in a domain service or hook instead.

## Test Scope
- Ensure no unused symbols.
- Verify failure path is observable.
