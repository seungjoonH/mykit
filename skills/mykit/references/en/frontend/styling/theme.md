# Theme

## Rules
- Define color/spacing/typography as tokens.
- Support light/dark modes via theme variables.
- Keep component styles token-driven.

## Do
- Toggle theme at app root and propagate through CSS variables.

## Don't
- Scatter hard-coded hex values across feature components.

## Do Example
```css
:root { --bg: #ffffff; --fg: #111111; }
[data-theme="dark"] { --bg: #0f1115; --fg: #f2f2f2; }
```

## Don't Example
```css
.page {
  background: #ffffff;
  color: #111111;
}

.dark .page {
  background: #0f1115;
  color: #f2f2f2;
}
```

## Boundaries
- Theme layer owns tokens and mode switches.
- Components consume variables only.

## Test Scope
- Light/dark visual contrast checks.
- Token regression snapshots.
- Before completion, run frontend tests or at minimum typecheck/lint.
