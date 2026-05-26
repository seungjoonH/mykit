# NestJS API

## Rules
- Controller owns DTO contract and response code mapping only.
- Keep ValidationPipe and ExceptionFilter as global standards.
- Keep OpenAPI schemas aligned with DTO definitions.

## Do
- Use `@Body() dto`, `class-validator`, and typed `HttpException` consistently.

## Don't
- Run domain decisions or repository calls directly in controllers.

## Example
```ts
@Post()
@HttpCode(201)
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

## Boundaries
- Controller: DTO contract, status code, docs.
- Service: domain rules and orchestration.
- Filter/interceptor: shared error/response formatting.

## Test Scope
- DTO validation success/failure.
- ExceptionFilter response contract.
