# React Query

## Rules
- Use React Query as the default server-state management layer.
- Design query keys consistently by domain.
- Invalidate related queries explicitly after mutations.

## Do
- Standardize `useQuery` and `useMutation` patterns in shared hooks.

## Don't
- Duplicate fetch and cache invalidation logic across components.

## Example
```ts
const useUserQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => api.getUser(id),
  });

const useUpdateUser = () =>
  useMutation({
    mutationFn: api.updateUser,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["user", vars.id] });
    },
  });
```

## Boundaries
- UI components should only call hooks and render.
- Query hook layer owns data-fetch and cache policy decisions.

## Test Scope
- Verify query key consistency and cache invalidation behavior.
- Verify loading/success/error rendering states.
- Before completion, run frontend tests or at minimum typecheck/lint.
