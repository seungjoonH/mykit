# Code Style

## Rules
- Use early return for nested conditions.
- Use switch for enum/type branching.
- When the same enum-based ternary chain returning different values repeats in multiple places, consolidate it into a lookup object.
- Use compact one-line form when a block has a single statement. Prefer one line for all code, including JSX. Wrap when the line is 100 characters or more including indent. Set Prettier `printWidth` to 100.
- Put `handleXxx` in the component body. JSX only receives a reference. Never `onClick={() => ...}`, even inside `map`. Close a row component if the item is needed.
- `onSubmit` uses `SubmitEvent<HTMLFormElement>`. Never `FormEvent`. `try` wraps one persist. Catch only maps.
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

```ts
// ✅ consolidate into a lookup object keyed by view
const VIEW_STRATEGY: Record<View, { days: DaysFn; range: RangeFn; shift: ShiftFn }> = {
  month: { days: getMonthDays, range: getMonthRange, shift: shiftMonth },
  day: { days: (anchor) => [anchor], range: getDayRange, shift: shiftDay },
  week: { days: getWeekDays, range: getWeekRange, shift: shiftWeek },
};
const { days, range, shift } = VIEW_STRATEGY[view];
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

const days = view === "month" ? getMonthDays() : view === "day" ? [anchor] : getWeekDays();
const range = view === "month" ? getMonthRange() : view === "day" ? getDayRange() : getWeekRange();
const shift = view === "month" ? shiftMonth : view === "day" ? shiftDay : shiftWeek;

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
