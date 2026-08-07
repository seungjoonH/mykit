# Naming

## Rules
- Use handleXxx for event handlers.
- Use is/has/can prefixes for booleans.
- Use domain terms, not temp/value/data.

## Do
- Name by behavior and business meaning.

## Don't
- Use generic placeholders in production code.

## Do Example
```ts
const hasPermission = user.role === "admin";
function handleSubmit() {
  if (!hasPermission) return;
  save();
}
```

## Don't Example
```ts
const value = user.role === "admin";
function submit() {
  if (!value) return;
  save();
}
```

## Boundaries
- Naming policy applies to all modules.
- Exceptions require explicit team decision.

## Test Scope
- PR review checklist includes naming.
- Reject unclear identifiers in critical modules.
