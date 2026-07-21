# Testing

## Rules
- Split tests by controller/service/repository boundaries.
- Start bug fixes with a failing reproduction test.
- Cover both success and failure paths for critical flows.

## Do
- Keep unit tests fast and use integration tests for contracts/persistence.

## Don't
- Over-couple tests to implementation details.

## Example
```ts
describe("UsersService.create", () => {
  it("throws on duplicated email", async () => {
    repository.exists.mockResolvedValue(true);
    await expect(service.create(input)).rejects.toThrow("email_conflict");
  });
});
```

## Boundaries
- Controller tests validate request/response contracts.
- Service tests validate business invariants.
- Repository tests validate DB mapping and queries.

## Test Scope
- New features: at least one unit + one integration test.
- Regression fixes: reproduction test is mandatory.
