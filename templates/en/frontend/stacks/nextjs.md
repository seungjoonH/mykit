# Next.js Stack

## Rules
- Keep route segments small and purpose-driven.
- Use Server Components by default and opt in to Client Components.
- Keep data fetching close to route boundaries.

## Do
- Put expensive fetch logic in server layer and pass minimal props down.

## Don't
- Mark whole pages with `"use client"` when only a small widget needs it.

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

## Boundaries
- Route/Page: fetch and compose.
- Client component: interactive UI only.
- Server module: domain data access.

## Test Scope
- Route rendering and metadata.
- Client interaction behavior.
- Before completion, run frontend tests or at minimum typecheck/lint.
