# Component

## Rules
- Keep rendering logic and state transition logic separate.
- One component should expose one clear responsibility.
- Move repeated UI blocks into child components or hooks.
- Move to a hook once a component has network requests plus 2 or more derived states (validation, computed values).

## Do
- Extract handlers and computed values before JSX return.

## Don't
- Inline complex IIFE or branching trees directly inside JSX.
- Never call `fetch` directly inside a component body — call it through the shared client module.
- Never leave a no-op expression statement (a line that only reads a value without using it).

## Example
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
function RoomEditForm({ initialData }: Props) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/rooms', { method: 'POST', body: JSON.stringify(formData) });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ state, validation, and the request move into a hook
function useRoomEditForm(initialData: RoomEditData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    return RoomService.update(formData);
  };
  return { formData, setFormData, isDisabled, handleSubmit };
}

function RoomEditForm({ initialData }: Props) {
  const { formData, setFormData, isDisabled, handleSubmit } = useRoomEditForm(initialData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Boundaries
- Page: route-level data and composition.
- Component: rendering and local UI interaction.
- Hook: reusable stateful behavior.
- Approved design, screen structure, states, and responsive requirements take priority over primitive reuse.
- Primitive reuse must not remove feature/page responsibilities or screen-specific CSS.
- A feature may own domain layout, density, hierarchy, and state presentation. A page may own shell, navigation, major composition, and page-level responsive layout.
- Repeated flex/grid is a signal to consider a layout primitive, not a ban on direct feature/page CSS.
- Removing an approved UI element or viewport behavior is a scope change, not simplification.

## Test Scope
- Rendering states the component actually owns; do not invent states to satisfy a checklist.
- Event-to-state transition correctness.
- A page is not complete until its spec structure, major viewports, and actual browser rendering have been visually checked.
- Functional tests passing is not evidence that the screen design is complete.
- Before completion, run frontend tests or at minimum typecheck/lint.
