# TailwindCSS

## Rules
- Keep utility classes readable and grouped by purpose.
- Extract repeated utility sets into component-level constants or wrappers.
- Use semantic tokens from design system, not arbitrary values.
- Prefer canonical classes to avoid lint warnings. Example: use `w-3.5` instead of `w-[14px]`.

## Do
- Prefer Tailwind canonical utility forms to keep lint clean.

## Don't
- Mix layout, color, and state classes in random order.
- Do not use or mention `buildCls` in Tailwind guidance/code.

## Example
```tsx
const className = `flex items-center gap-2 rounded-md px-3 py-2 ${
  isActive ? "bg-primary text-primary-foreground w-3.5" : "w-3.5"
}`;
```

## Boundaries
- Component layer owns utility composition.
- Theme layer owns token definitions and scales.

## Test Scope
- State variant class application.
- Responsive class behavior for major breakpoints.
- Before completion, run frontend tests or at minimum typecheck/lint.
