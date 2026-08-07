# Error Handling

## Rules
- Block predictable errors early.
- Never swallow errors silently.
- Manage error codes/messages through centralized global constants.

## Do
- Throw or return explicit domain error.
- Use shared error constants instead of duplicated string literals.

## Don't
- Use empty catch blocks.

## Do Example
```ts
export const ERROR = {
  INVALID_EVENT_PAYLOAD: "invalid_event_payload",
  AUTH_REQUIRED: "auth_required",
} as const;

try { event = JSON.parse(raw); }
catch { throw new Error(ERROR.INVALID_EVENT_PAYLOAD); }
```

## Don't Example
```ts
try { event = JSON.parse(raw); }
catch { throw new Error("invalid_event_payload"); } // avoid literal duplication
```

## Boundaries
- Transport errors at boundary.
- Domain errors in service/domain layer.

## Test Scope
- Test success and failure path.
- Verify error message and status mapping.
