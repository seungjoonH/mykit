# Security

## Rules
- Default to deny-by-default policy.
- Log authentication/authorization failures with trace context.
- Never expose secrets in code or logs.

## Do
- Enforce authz checks in guards/middleware before handlers.

## Don't
- Store or print tokens/keys/passwords in plain text.

## Example
```ts
app.get("/v1/admin/users", requireAuth, requireRole("admin"), async (_req, res) => {
  const users = await userService.list();
  res.json({ data: users });
});

function maskSecret(value: string) {
  return `${value.slice(0, 2)}***`;
}
logger.info("external_key", { key: maskSecret(process.env.EXTERNAL_KEY ?? "") });
```

## Boundaries
- Gateway/middleware owns authn/authz enforcement.
- Application layer handles only authorized requests.
- Infra layer owns secret storage and rotation.

## Test Scope
- `401/403` denial paths.
- Secret masking and non-exposure in logs.
