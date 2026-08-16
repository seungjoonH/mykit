# Code Hygiene

## Rules
- Remove unused imports/exports immediately.
- Do not hide failure with fallback-first coding.
- Keep domain-agnostic pure functions in `utils/` and reuse them.
- Never reimplement the same utility logic inline in every file.
- Never move logic that's still used in only one place into `utils/` on speculation. Extract it once it's actually needed in 2 or more places.
- Split `utils/` by concern (`date.ts`, `number.ts`, `string.ts`, etc.) instead of dumping everything into one `utils.ts`.

## Do
- Fix root cause before adding guard rails.
- Check `utils/` for an existing helper before adding a new one.

## Don't
- Silence errors with broad try-catch.
- Never repeat generic logic like date or number formatting inline inside a component or domain module.
- Never extract logic into `utils/` while it's still only used in one place.

## Common candidates
- Date/time: relative time, locale formatting, duration math.
- Number/currency: thousands separators, currency symbols, percentages, unit conversion (bytes to MB).
- String: truncate, slugify, capitalize, masking (email, phone number).
- Array/object: groupBy, uniqueBy, sortBy, pick/omit.
- Functional: debounce, throttle, memoize.
- Format validation: email, phone, URL shape checks (business-rule validation stays in the domain layer).

## Example
```ts
if (!response.ok) throw new Error("request_failed");
```

```typescript
// ❌ the same date-formatting logic is reimplemented in every file
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString('en-US');
}

function InvoiceDetail({ invoice }: Props) {
  const formatted = new Date(invoice.issuedAt).toLocaleDateString('en-US');
}
```

```typescript
// ✅ defined once in utils/
// utils/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US');
}
```

```typescript
// ❌ extracted to utils/ while only used in one place
// utils/formatOrderTitle.ts
export function formatOrderTitle(order: Order) {
  return `#${order.id} ${order.title}`;
}

// ✅ extract once a second use actually shows up; keep it inline until then
const title = `#${order.id} ${order.title}`;
```

## Boundaries
- Error handling belongs where error context exists.
- Fallback behavior must be explicit and reviewed.
- `utils/` holds pure functions with no domain knowledge. If domain rules or API calls creep in, it belongs in a domain service or hook instead.

## Test Scope
- Ensure no unused symbols.
- Verify failure path is observable.
- Pure functions only need input/output unit tests. Cover locale and edge-case inputs (empty array, zero, null).
