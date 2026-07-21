# Spring Backend

## Rules
- Keep `@RestController` focused on request/response contracts.
- Enforce input validation with `@Valid` DTOs.
- Standardize API errors via `@ControllerAdvice`.

## Do
- Use service layer for transaction/business logic and map to response DTOs.

## Don't
- Put transaction scripts or repository calls directly in controller methods.
- Return raw exception messages to API clients.

## Example
```java
@PostMapping("/v1/users")
public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
  UserResponse response = usersService.create(request);
  return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

## Boundaries
- Controller: mapping, validation entry, status code.
- Service: business rules and transaction scope.
- Repository: JPA/query abstraction.
- ControllerAdvice: shared API error contract.

## Test Scope
- Controller contract tests for validation/status.
- Service tests for business invariants.
- ControllerAdvice tests for error payload consistency.

## Security
See `../security.md` — same rules apply, no Spring-specific exceptions.

## Central Error Handling
- Detect and map exceptions in `@ControllerAdvice` to a single API error format.
- Keep controllers free from error serialization; service layer throws domain exceptions.
- Centralize error codes via shared constants and status-code mapping.

## Testing Strategy
See `../testing.md` — same rules apply. `Test Scope` above already covers this stack's specific boundaries.
