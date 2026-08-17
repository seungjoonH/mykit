# Accessibility

## Rules
- Before reaching for a native element, check whether the design system already has an SSOT component for this UI pattern.
- Prefer native HTML semantics over ARIA overrides.
- Guarantee a11y at the layer where meaning starts. `NameTextForm` owns label/aria. Call sites do not fill primitive labels.
- Interactive custom roles must be keyboard operable.
- Do not hide focusable elements with `aria-hidden`.

## Do
- Use `<button>`, `<a>`, `<ul>/<li>` before custom role elements.

## Don't
- Use clickable `div` without `tabIndex` and keyboard handlers.
- Never use `<input type="checkbox">` or `<select>` directly in screen code — replace it with the project's SSOT component. `<select>` is banned outright because it's hard to customize and its UX varies by browser; any custom Dropdown replacing it must still match native `<select>` on keyboard operation and accessibility.

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

```tsx
// ❌ native used directly in screen code, without checking for an SSOT
<input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
<select value={status} onChange={(e) => setStatus(e.target.value)}>...</select>

// ✅ reuse the project's SSOT component
<Checkbox checked={agreed} onChange={setAgreed} label="I agree to the terms" />
<Dropdown value={status} onChange={setStatus} options={statusOptions} />
```

## Boundaries
- Design system: provide accessible primitives.
- Feature component: compose primitives with labels and state.

## Test Scope
- Keyboard navigation and activation.
- Screen reader label and role verification.
- Before completion, run frontend tests or at minimum typecheck/lint.
