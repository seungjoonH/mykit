# Code Hygiene

## Rules
- Remove unused imports/exports immediately.
- Do not hide failure with fallback-first coding.
- Keep domain-agnostic pure transforms in `utils/`. Persist, auth, and API calls belong in a hook or domain layer.
- Extract a util even at a single call site when the logic is util-shaped. Look for that helper first on the next task and reuse it.
- Before writing a new format/transform function, check whether `utils/` already has one. Never hardcode a value that must stay consistent project-wide (like locale) inside a function.
- Do not dump unrelated implementation files at a domain folder root. Split by concern into subfolders. Do not make a folder per file.
- Count same-named TSX, CSS Module, hook, and type files as one logical implementation unit. At 20 or more direct units, review both role mixing and cohesion. Never split on count alone.
- A design system with one abstraction level may stay flat. Move domain-specific implementations out of shared folders and into their domain layer.

## Do
- Fix root cause before adding guard rails.
- Check `utils/` for an existing helper before adding a new one.

## Don't
- Silence errors with broad try-catch.
- Never put persist or auth into `utils/`.
- Never leave a util-shaped pure transform inline just because it has one call site.

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
// ❌ a shared util exists, but each page reimplements it locally with the locale hardcoded
function formatTimeRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt.format(new Date(start))}-${fmt.format(new Date(end))}`;
}
```

```ts
// ❌ the same date-formatting logic is reimplemented in every file
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString("en-US");
}
```

```ts
// ❌ persist or auth in utils/
export async function saveTicket(formData: Ticket) {
  return TicketService.update(formData);
}

// ✅ domain-free pure transform only. Extract even at one call site when it is a util
export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
```

## Boundaries
- Error handling belongs where error context exists.
- Fallback behavior must be explicit and reviewed.
- `utils/` holds pure functions with no domain knowledge. If domain rules or API calls creep in, it belongs in a domain service or hook instead.

## Test Scope
- Ensure no unused symbols.
- Verify failure path is observable.
