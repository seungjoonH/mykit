# Component

## Rules
- Keep rendering logic and state transition logic separate.
- One component should expose one clear responsibility.
- Move repeated UI blocks into child components or hooks.
- Move to a hook once a component has network requests plus 2 or more derived states (validation, computed values).
- Keep components light at all times. Move complex logic out of the component and into a hook.
- Judge a hook's "responsibility" by feature or domain, not by how many pieces of state or effects it has. State, effects, and event listeners that all belong to one feature can live in a single hook. The real test is not mixing unrelated features into one hook. No matter how complex a hook is internally, what it returns should stay simple.
- Once a hook's responsibility boundary is set, never shuffle logic in and out of it.
- In projects using a state store, never pull values out of the store in a component and re-inject them as parameters into another hook. The domain hook uses the store directly, and instead of re-exposing the store's raw API, it returns an action-level API for what the component actually does.
- Never inject an `onSuccess`/`onError` callback into a feature hook (a hook that owns one whole feature) to run the component's UI behavior from inside it. The hook returns its result state only; the caller decides what to do with that result.
- A store's API consists only of state names and the verbs that change them. Multi-step domain actions like `checkout` or `applyCoupon` belong in the domain hook, not the store.
- Keep the return shape of feature hooks and stores consistent across the whole project. A store's action expresses a state change; a domain hook's action expresses a user action. Never mix the two in the same return value.
- If a component only needs part of a domain, not all of it, a narrower purpose-built hook is fine (e.g. `useCartSummary()`).
- Whenever designing or reviewing a hook, component, or store, ask whether this param and this return value are really needed.
- Not being able to use hooks in a Server Component is not a license to dump every concern into one function. Move the guard, param parsing, data fetch, and derived computation into a page-specific loader function; the component only renders the loader's result.
- Never hand-list several items with nearly identical transform rules inside a JSX prop. Pull them into a declarative config array and build them with `map`.
- Close each field as a meaning unit. Putting `label={t('name')}` on `TextField` is the same skip as using `Chip` instead of `StatusChip`. Specify it into `NameTextForm`.
- `feature`/`page` must not import interactive primitives.
- Keep tsx, css, hook, and `type.ts` of one meaning in that unit's own folder. Do not dump them as siblings in a layer, domain, or route root.

## Do
- Extract handlers and computed values before JSX return. Put `handleXxx` in the component body. JSX only receives a reference. Never `onClick={() => ...}`, even inside `map`.

## Don't
- Inline complex IIFE or branching trees directly inside JSX.
- Never type props with an inline object literal in the function signature. Always give props a named type.
- Never call `fetch` directly inside a component body. Call it through a domain service function (e.g. `UserService.update()`) and never expose URL, method, or header assembly in the component.
- Never leave a no-op expression statement (a line that only reads a value without using it).
- Never put `TextField` in `feature`/`page` JSX and fill `label`/`type`/`required` from the outside.

## Example
```tsx
// ❌ hand-lists items that share nearly the same transform rule
<DefinitionList items={[
  { label: t('field.name'), value: entity.name?.trim() || t('notSet') },
  { label: t('field.email'), value: entity.email?.trim() || t('notSet') },
  { label: t('field.phone'), value: entity.phone?.trim() || t('notSet') },
  // ...20+ more
]} />

// ✅ pulls the field list into a declarative config and generates it with map
const DETAIL_FIELDS = [
  { key: 'name', labelKey: 'field.name' },
  { key: 'email', labelKey: 'field.email' },
  { key: 'phone', labelKey: 'field.phone' },
] as const;

const items = DETAIL_FIELDS.map(({ key, labelKey }) => ({
  label: t(labelKey),
  value: entity[key]?.trim() || t('notSet'),
}));

<DefinitionList items={items} />
```

```tsx
// ❌ feature assembles an interactive primitive directly
<TextField label={t('name')} value={fields.name} onChange={handleNameChange} />

// ✅ close it as a meaning unit
<NameTextForm value={fields.name} onChange={handleNameChange} />
```

```tsx
function ResultPanel({ items }: Props) {
  const visibleItems = items.filter((item) => item.visible);
  const isEmpty = visibleItems.length === 0;

  if (isEmpty) return <EmptyState />;
  return <ResultList items={visibleItems} />;
}
```

```tsx
// ❌ fetch and derived validation stay inline in the component
function TicketEditForm({ initialData }: Props) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/tickets', { method: 'POST', body: JSON.stringify(formData) });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ state, validation, and the request move into a hook
function useTicketEditForm(initialData: TicketEditData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    return TicketService.update(formData);
  };
  return { formData, setFormData, isDisabled, handleSubmit };
}

function TicketEditForm({ initialData }: Props) {
  const { formData, setFormData, isDisabled, handleSubmit } = useTicketEditForm(initialData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Boundaries
- Page: route-level data and composition.
- Component: rendering and local UI interaction.
- Hook: reusable stateful behavior (base hook), or domain logic owning one whole feature (feature hook).
- Approved design, screen structure, states, and responsive requirements take priority over primitive reuse.
- Primitive reuse must not remove feature/page responsibilities or screen-specific CSS.
- A feature may own domain layout, density, hierarchy, and state presentation. A page may own shell, navigation, major composition, and page-level responsive layout.
- Repeated flex/grid is a signal to consider a layout primitive, not a ban on direct feature/page CSS.
- Removing an approved UI element or viewport behavior is a scope change, not simplification.
- Close each field as a meaning unit such as `NameTextForm`. `feature`/`page` must not import interactive primitives.

## Test Scope
- Rendering states the component actually owns; do not invent states to satisfy a checklist.
- Event-to-state transition correctness.
- A page is not complete until its spec structure, major viewports, and actual browser rendering have been visually checked.
- Functional tests passing is not evidence that the screen design is complete.
- Before completion, run frontend tests or at minimum typecheck/lint.
