# Express Backend

## Applicability
- Apply this document only when the target package directly depends on `express` and does not use a
  higher-level framework such as Nest or Next.
- Skip the entire Express layering contract when `@nestjs/*`, `next`, `next.config.*`, or a Nest
  application structure is present.
- In a monorepo, classify the package being changed instead of the repository as a whole.
- Apply this contract whenever standalone Express code is created or changed, including through
  `code-refactoring`.
- Follow `actions/review-code-style.md` first for code expression and formatting.

## Rules
- Keep route handlers minimal and contract-focused.
- Validate request payloads at route boundaries with schema middleware.
- Standardize error response shape through one central error handler.
- Keep dependencies moving from router to controller to service to repository.
- Keep services independent of Express. They must not receive or inspect `req`, `res`, or `next`.
- Use English for default and newly introduced error messages unless the user requests another
  language.

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
- Router: URL, HTTP method, boundary middleware, and controller wiring only.
- Controller: HTTP input/output mapping only.
- Service: validation, business rules, authorization decisions, and orchestration.
- Repository: query/persistence mapping.
- Error middleware: unified error payload.

## Required Contracts
- Represent expected failures with `AppError` subclasses such as `ValidationError`,
  `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, and `ConflictError`.
- Return success through `sendSuccess` as `{ ok: true, data, meta? }`.
- Return failures as `{ ok: false, error: { code, message, details?, requestId } }`.
- Add a request ID through `requestContext`, normalize authenticated sessions into `req.user` through
  `requireLogin`, and convert unmatched routes through `notFoundHandler`.
- Register the central `errorHandler` last. Do not expose unexpected error messages, stacks, SQL, or
  other internals to clients.
- Create only the layers required by the changed feature. Do not add placeholder adapters or unused
  variants, but close the router/controller/service/repository unit for that feature.

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
