# Next.js Stack

## Rules
- Keep route segments small and purpose-driven.
- Use Server Components by default and opt in to Client Components.
- Keep data fetching close to route boundaries.
- Route Handlers (`route.ts`) only export functions named exactly `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`HEAD`/`OPTIONS`. Nothing else is recognized as a handler.
- Server Actions (`"use server"`) are for mutations only. Never use them for parallel data fetching — they queue and run sequentially.
- Any module that touches a secret, a service-role client, or another server-only credential must import `server-only` at its top and must not export pure/client-safe values from the same file.
- A file that mixes pure logic (types, constants, formatting) with server-only DB access is a defect, not a style choice — split it before a Client Component transitively imports it.

## Do
- Put expensive fetch logic in server layer and pass minimal props down.
- Put server-only DB/service-role access in its own module (a DAL — Data Access Layer) that a Route Handler or Server Action calls into; never call `createServiceRoleClient()`-equivalents directly from a Route Handler or Server Action body.
- Keep redirect/response construction in one place per request handler (one `goTo(path)`-style helper), not repeated inline at every branch.
- Keep URL path strings behind small, parameter-minimal builder functions (e.g. `adminLoginPath()`) instead of inlining `` `/admin/login?error=${x}` `` at each call site.
- Encode a domain error as a typed discriminant (`code: "wrong_org" | "admin" | ...`) instead of pattern-matching a human-readable message string.

## Don't
- Mark whole pages with `"use client"` when only a small widget needs it.
- Don't branch control flow on `error.message.includes(...)`. The message is for humans; branch on a typed `code` the producer already knows.
- Don't let a Client Component import a module that also exports a service-role-touching function, even if the component only uses an unrelated export from that file — the whole module still enters the client bundle graph.
- Don't scatter `fetch("/api/...")` calls for the same endpoint across multiple components with different error-handling per call site; wrap it once in a client function.

## Example
```tsx
// app/users/page.tsx
import { getUsers } from "@/server/users";
import { UserTable } from "./UserTable";

export default async function UsersPage() {
  const users = await getUsers();
  return <UserTable users={users} />;
}
```

```ts
// lib/organizations/get-organization-display.ts (server-only DAL)
import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getOrganizationDisplay(organizationId: string) {
  const db = createServiceRoleClient();
  const { data } = await db.from("organizations").select("*").eq("id", organizationId).single();
  return data;
}
```
```ts
// lib/organizations/organization-locale.ts (client-safe — no server-only import)
export type OrganizationLocale = { timezone: string; dateFormat: string };
export const DEFAULT_ORGANIZATION_LOCALE: OrganizationLocale = { timezone: "UTC", dateFormat: "MM/dd/yyyy" };
```
```ts
// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { oauthFailurePath } from "@/lib/auth/login-path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const goTo = (path: string) => NextResponse.redirect(new URL(path, url.origin));
  // ...
  if (error) return goTo(oauthFailurePath(ctx, "oauth"));
}
```

## Boundaries
- Route/Page: fetch and compose.
- Client component: interactive UI only.
- Server module: domain data access.
- Route Handler / Server Action: parse the request, call one DAL function, map the result to a Response or a typed action result. No inline SQL/query-builder calls.
- DAL module (`server-only`): the only place that calls the service-role client or reads a server secret. Pure functions and types live in a sibling module without `server-only`, never in the same file.
- Path/redirect builder module: pure string functions, zero framework imports (no `NextResponse`, no React). Consumed by both Route Handlers and Server Components.

## Test Scope
- Route rendering and metadata.
- Client interaction behavior.
- Route Handler: request→response contract, status codes, auth rejection.
- DAL module: query shape and error mapping (mock the client).
- Path builder module: pure unit tests, no mocking needed.
- Before completion, run frontend tests or at minimum typecheck/lint. A production build (`next build`) is required at least once per session that touches server/client boundaries — a Client Component transitively importing a `server-only` module is a build-time-only error that typecheck/lint do not catch.

## Security
See `../../security.md` — same rules apply. In addition: a module reachable from a Client Component that turns out to also export a `server-only`-tagged sibling function is treated as a leak, not a style nit, even if bundler tree-shaking might drop the unused code in practice — don't rely on tree-shaking to keep secrets out of the client bundle.
