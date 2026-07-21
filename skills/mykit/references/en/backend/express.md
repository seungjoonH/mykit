# Express Backend

## Rules
- Keep route handlers minimal and contract-focused.
- Validate request payloads at route boundaries with schema middleware.
- Standardize error response shape through one central error handler.

## Do
- Use `validate(schema)` and `asyncHandler` in every mutable endpoint.
- Delegate business logic and persistence to service/repository layers.

## Don't
- Build ad-hoc response/error formats per route.
- Mix business decisions and query composition in route files.

## Example
```ts
router.post("/v1/users", validate(createUserSchema), asyncHandler(async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json({ data: user });
}));
```

## Boundaries
- Router: validation, status code, contract mapping.
- Service: business rules and orchestration.
- Repository: query/persistence mapping.
- Error middleware: unified error payload.

## Test Scope
- Contract tests for `400`, `201`, and error payload shape.
- Service tests for business invariant violations.
- Repository tests for query behavior.

## Security
See `../security.md` — same rules apply, no Express-specific exceptions.

## Central Error Handling
- Detect and map all runtime errors in a single `errorHandler` middleware.
- Force handlers to flow through central handling via `next(error)` or `asyncHandler`.
- Manage domain error codes through shared constants and status-code mapping tables.

## Testing Strategy
See `../testing.md` — same rules apply. `Test Scope` above already covers this stack's specific boundaries.
