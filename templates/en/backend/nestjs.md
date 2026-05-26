# NestJS Backend

## Rules
- Controller handles transport concerns only.
- Service owns business rules and orchestration.
- Repository owns persistence concerns only.
- Keep ValidationPipe and ExceptionFilter as global API contract standards.

## Do
- Use DTO + validation pipe in controller boundary, throw typed exceptions in service.
- Keep Swagger/OpenAPI specs aligned with DTOs and response envelopes.

## Don't
- Place business logic or query composition directly in controller.
- Return endpoint-specific error payloads that bypass exception filters.

## Example
```ts
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

## Boundaries
- Controller: DTO binding, status code mapping, guard wiring.
- Service: business rules, transaction, domain exceptions.
- Repository: ORM/query builder and persistence mapping.
- Filter/Interceptor: shared error and response contract.

## Test Scope
- Controller: request contract/validation/response code.
- Service: business invariants and failure scenarios.
- Repository: query and persistence integration tests.
- Filter: standardized error payload mapping.

## Security
- Apply deny-by-default and enforce auth checks in guards before handlers.
- Keep auth failures mapped consistently to `401/403`.
- Store secrets outside code and enforce masked logging.

## Central Error Handling
- Detect and map exceptions through a global `ExceptionFilter` into one response contract.
- Let services throw domain exceptions; keep controllers free from error serialization logic.
- Centralize error codes with shared constants and HTTP status mapping.

## Testing Strategy
- Begin every bug fix with a reproduction test.
- Split tests by controller/service/repository responsibility boundaries.
- Keep tests focused on contracts and invariants over internals.
