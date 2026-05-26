# Accessibility

## Rules
- Prefer native HTML semantics over ARIA overrides.
- Interactive custom roles must be keyboard operable.
- Do not hide focusable elements with `aria-hidden`.

## Do
- Use `<button>`, `<a>`, `<ul>/<li>` before custom role elements.

## Don't
- Use clickable `div` without `tabIndex` and keyboard handlers.

## Example
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "Enter" || e.key === " ") onOpen();
};

<div
  role="button"
  tabIndex={0}
  onClick={onOpen}
  onKeyDown={handleKeyDown}
>
  Open
</div>
```

## Boundaries
- Design system: provide accessible primitives.
- Feature component: compose primitives with labels and state.

## Test Scope
- Keyboard navigation and activation.
- Screen reader label and role verification.
- Before completion, run frontend tests or at minimum typecheck/lint.
