# React Vite Stack

## Rules
- Keep route/view modules focused and composable.
- Keep data-fetch boundaries explicit between view and API layers.

## Do
- Keep Vite build config minimal and feature code framework-centric.

## Don't
- Mix server-side domain logic directly into UI modules.

## Example
```tsx
function UsersPage() {
  const { data } = useUsersQuery();
  return <UsersTable rows={data ?? []} />;
}
```

## Boundaries
- View layer owns rendering and interaction.
- Data hooks own fetching and cache strategy.

## Test Scope
- Component rendering and user interaction tests.
- Complete frontend checks with tests or at least typecheck/lint before completion.
