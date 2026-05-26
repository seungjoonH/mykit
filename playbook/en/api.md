# API

## Rules
- Keep API contracts stable by version and schema.
- Validate requests at endpoint boundaries.
- Standardize error response shape across endpoints.

## Do
- Use DTO/schema validation and explicit error codes.

## Don't
- Return endpoint-specific ad-hoc error formats.

## Example
```ts
type ApiError = { code: string; message: string };

app.post("/v1/users", validate(createUserSchema), async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json({ data: user });
});

app.use((err, _req, res, _next) => {
  const error: ApiError = normalizeApiError(err);
  res.status(mapStatus(error.code)).json({ error });
});
```

## Boundaries
- Route/controller owns validation and response contracts.
- Service owns business rules and domain exceptions.
- Repository owns persistence queries only.

## Test Scope
- Contract tests for required fields and error codes.
- Backward compatibility tests for previous schema versions.
