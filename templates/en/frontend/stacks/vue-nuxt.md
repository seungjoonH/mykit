# Vue Nuxt Stack

## Rules
- Keep route page responsibilities explicit in Nuxt directory conventions.
- Separate composables, components, and server routes cleanly.

## Do
- Keep data access in composables or server routes, not in template blocks.

## Don't
- Embed backend business rules directly in page templates.

## Example
```vue
<script setup lang="ts">
const { data } = await useAsyncData("users", () => $fetch("/api/users"));
</script>
```

## Boundaries
- Page/component layer owns rendering concerns.
- Composable/server route layer owns data retrieval.

## Test Scope
- Route render and composable behavior tests.
- Complete frontend checks with tests or at least typecheck/lint before completion.
