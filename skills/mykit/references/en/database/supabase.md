# Supabase

## Rules
- Treat Supabase as Postgres first: manage schema with migrations and reviewed SQL.
- Enable Row Level Security (RLS) for every exposed table and make policies explicit. User-scoped reads and writes use the session client and RLS by default. Service-role is the exception.
- Keep service role keys only on trusted server environments. Pages and routes must not call a service-role client directly.
- Never loop and issue one query per item (N+1). Use `.in()`/a join, or a single RPC, to fetch or update a batch in one call.
- When a request writes across multiple tables in sequence, wrap the whole write in a Postgres function called via `.rpc()` so it either fully succeeds or fully rolls back. Do not rely on manually compensating only the first step.

## Do
- Use authenticated client keys on frontend and reserve service role usage for backend jobs.
- Batch per-row reads/writes with `.in()` or a single RPC call.

## Don't
- Bypass RLS by querying exposed tables with elevated keys from client code.
- Call `.select()`/`.update()` once per item inside a loop when a batched call would do.

## Example
```sql
alter table public.todos enable row level security;

create policy "users can read own todos"
on public.todos
for select
using (auth.uid() = user_id);
```

```ts
// ❌ N+1: one query per row
for (const id of ids) {
  const { data } = await supabase.from("profiles").select("*").eq("id", id);
}

// ✅ one batched query
const { data } = await supabase.from("profiles").select("*").in("id", ids);
```

## Boundaries
- SQL migration layer owns schema and policy changes.
- Backend layer owns service-role operations.
- Frontend layer owns user-scoped queries only.
- Multi-table writes that must succeed or fail together belong in a Postgres RPC function, not sequential client-side calls.

## Test Scope
- RLS policy tests for allow/deny paths.
- Authenticated vs service-role access regression checks.
