# Code Hygiene

## Rules
- Remove unused imports/exports immediately.
- Do not hide failure with fallback-first coding.
- Keep domain-agnostic pure transforms in `utils/`. Persist, auth, and API calls belong in a hook or domain layer.
- Never reimplement the same utility logic inline in every file.
- Before writing a new format/transform function, check whether `utils/` already has one. Never hardcode a value that must stay consistent project-wide (like locale) inside a function — hardcoding it differently per file becomes a bug where each screen looks different.
- Extract a util even at a single call site when the logic is util-shaped. Look for that helper first on the next task and reuse it.
- Split `utils/` by concern (`date.ts`, `number.ts`, `string.ts`, etc.) instead of dumping everything into one `utils.ts`.
- Do not dump unrelated implementation files at a domain folder root. Split by concern into subfolders. Do not make a folder per file.
- Count same-named TSX, CSS Module, hook, and type files as one logical implementation unit. At 20 or more direct units, review both role mixing and cohesion. Never split on count alone.
- A design system with one abstraction level may stay flat. Move domain-specific implementations out of shared folders and into their domain layer.

## Do
- Fix root cause before adding guard rails.
- Check `utils/` for an existing helper before adding a new one.

## Don't
- Silence errors with broad try-catch.
- Never repeat generic logic like date or number formatting inline inside a component or domain module.
- Never put persist or auth into `utils/`.
- Never leave a util-shaped pure transform inline just because it has one call site.

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
// ❌ a shared util exists, but each page reimplements it locally with the locale hardcoded
function formatTimeRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${fmt.format(new Date(start))}-${fmt.format(new Date(end))}`;
}

// ✅ reuse the existing shared util and pass locale in as a parameter
import { formatDateTime } from '@/utils/date';
const range = `${formatDateTime(start, locale)}-${formatDateTime(end, locale)}`;
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
// ❌ persist or auth in utils/
export async function saveTicket(formData: Ticket) {
  return TicketService.update(formData);
}

// ✅ domain-free pure transform only. Extract even at one call site when it is a util
export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
```

## Boundaries
- Error handling belongs where error context exists.
- Fallback behavior must be explicit and reviewed.
- `utils/` holds pure functions with no domain knowledge. If domain rules or API calls creep in, it belongs in a domain service or hook instead.

## Test Scope
- Ensure no unused symbols.
- Verify failure path is observable.
- Pure functions only need input/output unit tests. Cover locale and edge-case inputs (empty array, zero, null).
