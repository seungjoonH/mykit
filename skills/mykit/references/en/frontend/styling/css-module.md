# CSS Modules

## Rules
- Keep all component styles in `*.module.css`.
- Prefer class toggles over inline style objects.
- Scope naming to component purpose (`root`, `title`, `item`).
- Use the `buildCls` utility below for class composition.

## Do
- Compute className before JSX return.
- Reuse the helper from `src/lib/buildCls.ts`.

## Don't
- Do not call `buildCls` with a single argument. Example: avoid `buildCls(styles.root)` and use `className={styles.root}` instead.

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

## Boundaries
- Component module owns its stylesheet.
- Global stylesheet should only contain reset/theme primitives.

## Test Scope
- Variant class toggling.
- Visual regression for key states.
- Before completion, run frontend tests or at minimum typecheck/lint.
