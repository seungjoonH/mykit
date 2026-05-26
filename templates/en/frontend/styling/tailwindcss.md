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
- Avoid complex inline template-string branching for class composition.

## Do Example
```tsx
const className = buildCls(
  "flex items-center gap-2 rounded-md px-3 py-2 w-3.5",
  isActive && "bg-primary text-primary-foreground",
);
```

## Don't Example
```tsx
const className = isActive
  ? "text-white px-3 items-center py-2 flex bg-blue-500 w-[14px]"
  : "px-3 py-2 flex items-center w-[14px]";
```

## Boundaries
- Component layer owns utility composition.
- Theme layer owns token definitions and scales.

## Test Scope
- State variant class application.
- Responsive class behavior for major breakpoints.
- Before completion, run frontend tests or at minimum typecheck/lint.
