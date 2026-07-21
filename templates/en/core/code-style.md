# Code Style

## Rules
- Use early return for nested conditions.
- Use switch for enum/type branching.
- Use compact one-line form when a block has a single statement.
- Use the `is` package for runtime type checks. (`npm install is`)

## Do
- Normalize control-flow style across all stacks.
- Standardize runtime type checks with `is`.

## Don't
- Mix multiline and compressed patterns randomly.

## Do Example
```ts
import is from "is";

if (ok) run();
else fallback();

if (!is.string(payload.id)) {
  throw new Error("invalid_id");
}

function handleSubmit(value: string | null) {
  if (value) return save(value);
}

for (const item of items) {
  if (!item.enabled) continue;
  process(item);
}

switch (kind) {
  case "ping": break;
  default: break;
}

try { execute(); }
catch { recover(); }
```

## Don't Example
```ts
if (ok) {
  run();
}
else {
  fallback();
}

function handleSubmit(value: string | null) {
  if (value) {
    save(value);
  }
  else {
    doSomething();
  }
}

function handleSubmit(value: string | null) {
  if (!value) return;
  save(value);
}

for (const item of items) {
  if (item.enabled) {
    process(item);
  }
}

if (kind === "ping") {
  ping();
}
if (kind === "pong") {
  pong();
}

try { 
  execute(); 
}
catch { 
  recover(); 
}
```

## Boundaries
- This style rule applies across frontend and backend layers.
- Architecture responsibility boundaries are defined in stack docs (`backend/*`, `frontend/stacks/*`).

## Test Scope
- Lint style rules.
- Review representative control-flow samples.
