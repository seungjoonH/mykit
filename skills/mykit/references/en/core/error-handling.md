# Error Handling

## Rules
- Block predictable errors early.
- Never swallow errors silently.
- Manage error codes/messages through centralized global constants.
- When request and failure handling (parsing, error mapping) repeats across call sites, consolidate it into one client module.
- Wrapping the client module is not the finish line. Call sites (components, hooks) never touch URL, method, header, or try/catch directly; they only call functions with domain meaning.
- API call functions for the same resource are not scattered individually - bundle them into one service module to keep the code cohesive.

## Do
- Throw or return explicit domain error.
- Use shared error constants instead of duplicated string literals.

## Don't
- Use empty catch blocks.
- Never re-implement try/catch and response parsing per call site.
- Never let a call site assemble the client module's URL, method, and header directly.

## Do Example
```ts
export const ERROR = {
  INVALID_EVENT_PAYLOAD: "invalid_event_payload",
  AUTH_REQUIRED: "auth_required",
} as const;

try { event = JSON.parse(raw); }
catch { throw new Error(ERROR.INVALID_EVENT_PAYLOAD); }
```

```ts
// ✅ one client owns the request and its failure handling
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? ERROR.REQUEST_FAILED);
  }
  return res.json();
}

const getUser = (id: string) => request<User>(`/api/users/${id}`);
const updateUser = (id: string, data: UserInput) =>
  request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
```

```ts
// ✅ a domain function fully hides URL, method, header, and failure handling
const UserService = {
  get: (id: string) => request<User>(`/api/users/${id}`),
  update: (id: string, data: UserInput) =>
    request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// the call site is left with intent only
await UserService.update(id, data);
```

## Don't Example
```ts
try { event = JSON.parse(raw); }
catch { throw new Error("invalid_event_payload"); } // avoid literal duplication
```

```ts
// ❌ request and failure handling reimplemented at every call site
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("failed");
  return res.json();
}

async function updateUser(id: string, data: UserInput) {
  const res = await fetch(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("failed"); // same failure handling repeated
  return res.json();
}
```

```ts
// ❌ still not enough - the client is unified, but the call site still assembles URL, method, and failure handling
try {
  await request(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
} catch (err) {
  setError(err instanceof Error ? err.message : "The request failed.");
}
```

## Boundaries
- Transport errors at boundary.
- Domain errors in service/domain layer.

## Test Scope
- Test success and failure path.
- Verify error message and status mapping.
