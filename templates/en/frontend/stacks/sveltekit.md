# SvelteKit Stack

## Rules
- Keep load functions focused on route data needs.
- Separate UI state from server data loading concerns.

## Do
- Keep endpoint logic in `+server` and UI logic in `+page`.

## Don't
- Put backend business logic directly in component event handlers.

## Example
```ts
// +page.ts
export const load = async ({ fetch }) => {
  const users = await fetch("/api/users").then((r) => r.json());
  return { users };
};
```

## Boundaries
- Route load/server endpoints own data flow.
- Components own rendering and interaction.

## Test Scope
- Load function and component interaction tests.
- Complete frontend checks with tests or at least typecheck/lint before completion.
