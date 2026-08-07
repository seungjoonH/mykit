# SVG Icon

## Rules
- Manage icons through a single `icons.svg` sprite with `<symbol>`.
- Keep a consistent icon size baseline (`viewBox`) across symbols.
- Use `currentColor` for icon fill so color is controlled externally.

## Do
- Render icons through a shared `Icon` component using `<use href={...}>`.
- Keep symbol coordinates and size consistent when adding new icons.

## Don't
- Duplicate raw SVG markup in feature components.
- Mix different symbol sizes or hard-coded fill colors.
- Use Unicode symbols, arrow characters, emoji, or text glyphs as UI icons.

## Example
```tsx
const Icon = memo(function Icon({ name, size }: IconProps) {
  const resolvedName = name || "photo";
  const href = Paths.icons(resolvedName);
  const className = CSSUtil.buildCls(styles.icon, styles[size]);

  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <use href={href} />
    </svg>
  );
});
```

## Boundaries
- `icons.svg` owns symbol source and size consistency.
- `Icon` component only resolves and renders the symbol.
- Use the shared `Icon`/`IconButton` contract for repeated icons and interactive icon controls. A one-off illustration or meaningful screen-specific SVG may stay owned by its feature/page instead of becoming a primitive.
- Decorative icons are hidden from assistive technology. Functional icon controls have accessible names and use a text label when the icon alone is ambiguous.

## Test Scope
- Validate consistent `viewBox` for new symbols.
- Validate external color control via `currentColor`.
- Before completion, run frontend tests or at minimum typecheck/lint.
