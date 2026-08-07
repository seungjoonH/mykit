# Data Design

## Rules
- Express UI logic with data fields first.
- Prefer data model updates over branch explosion.

## Do
- Add semantic attributes to data shape.

## Don't
- Keep adding one-off if branches.

## Do Example
```ts
const isSpecial = item.kind === "project" && item.status === "deprecated";
```

## Don't Example
```ts
if (item.kind === "project" && item.status === "deprecated") {
  // special case
}
if (item.kind === "project" && item.isPreview) {
  // another special case
}
```

## Boundaries
- Data model owns state semantics.
- Rendering layer consumes, not invents, semantics.

## Test Scope
- Schema-level test for new attributes.
- UI behavior test from data input.
