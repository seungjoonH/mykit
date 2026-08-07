# Readability

## Rules
- Write code that explains intent without extra context.
- Keep related logic close and unrelated logic separated.

## Do
- Prefer explicit names and small units.

## Don't
- Hide business meaning behind generic names.

## Do Example
```ts
const isValidTarget = node instanceof Node && ref.current?.contains(node);
if (!isValidTarget) return;
processTarget(node);
```

## Don't Example
```ts
const data = node && ref.current && ref.current.contains(node);
if (data) {
  processTarget(node);
}
```

## Boundaries
- A function should keep one reason to change.
- A module should represent one domain concern.

## Test Scope
- Review naming and flow in PR.
- Add one representative test per critical path.
