# Component

## Rules
- Keep rendering logic and state transition logic separate.
- One component should expose one clear responsibility.
- Move repeated UI blocks into child components or hooks.

## Do
- Extract handlers and computed values before JSX return.

## Don't
- Inline complex IIFE or branching trees directly inside JSX.

## Example
```tsx
function ResultPanel({ items }: Props) {
  const visibleItems = items.filter((item) => item.visible);
  const isEmpty = visibleItems.length === 0;

  if (isEmpty) return <EmptyState />;
  return <ResultList items={visibleItems} />;
}
```

## Boundaries
- Page: route-level data and composition.
- Component: rendering and local UI interaction.
- Hook: reusable stateful behavior.

## Test Scope
- Rendering states (`empty`, `loading`, `data`).
- Event-to-state transition correctness.
- Before completion, run frontend tests or at minimum typecheck/lint.
