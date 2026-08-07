# CSS Modules

## Rules
- Keep all component styles in `*.module.css`.
- Prefer class toggles over inline style objects.
- Scope naming to component purpose (`root`, `title`, `item`).
- Use the `buildCls` utility below for class composition.

## Do
- Compute className before JSX return.
- Reuse the helper from `src/lib/buildCls.ts`.
- Import and apply the component's own CSS Module. Internal class assignment such as `className={styles.root}` is the recommended pattern.
- Let features and pages own CSS Modules for screen-specific layout, hierarchy, density, responsive media queries, and container queries.

## Don't
- Do not call `buildCls` with a single argument. Example: avoid `buildCls(styles.root)` and use `className={styles.root}` instead.
- Do not expose `className` or `style` as a public style escape hatch by default. If one is necessary, review and document ownership and its contract.

## Do Example
```tsx
export function buildCls(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ").trim();
}

const className = buildCls(styles.root, isOpen && styles.open);
return <section className={className}>...</section>;
```

## Don't Example
```tsx
const className = buildCls(styles.root);
return <section className={className}>...</section>;
```

```tsx
// Public style escape hatch: callers can override internal design.
function Card({ className }: { className?: string }) {
  return <article className={buildCls(styles.root, className)} />;
}
```

## Boundaries
- Component module owns its stylesheet.
- Primitive reuse does not remove feature/page stylesheets. Screen-specific flex/grid and responsive CSS are allowed.
- Global stylesheet should only contain reset/theme primitives.

## Test Scope
- Variant class toggling.
- Visual regression for key states.
- Before completion, run frontend tests or at minimum typecheck/lint.
