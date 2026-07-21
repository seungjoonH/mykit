# Supabase

## Rules
- Treat Supabase as Postgres first: manage schema with migrations and reviewed SQL.
- Enable Row Level Security (RLS) for every exposed table and make policies explicit.
- Keep service role keys only on trusted server environments.

## Do
- Use authenticated client keys on frontend and reserve service role usage for backend jobs.

## Don't
- Bypass RLS by querying exposed tables with elevated keys from client code.

## Example
```sql
alter table public.todos enable row level security;

create policy "users can read own todos"
on public.todos
for select
using (auth.uid() = user_id);
```

## Boundaries
- SQL migration layer owns schema and policy changes.
- Backend layer owns service-role operations.
- Frontend layer owns user-scoped queries only.

## Test Scope
- RLS policy tests for allow/deny paths.
- Authenticated vs service-role access regression checks.
