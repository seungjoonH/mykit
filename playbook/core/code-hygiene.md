# Code Hygiene

## Rules
- Remove unused imports/exports immediately.
- Do not hide failure with fallback-first coding.

## Do
- Fix root cause before adding guard rails.

## Don't
- Silence errors with broad try-catch.

## Do Example
```ts
if (!response.ok) throw new Error("request_failed");
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

## Boundaries
- Error handling belongs where error context exists.
- Fallback behavior must be explicit and reviewed.

## Test Scope
- Ensure no unused symbols.
- Verify failure path is observable.
