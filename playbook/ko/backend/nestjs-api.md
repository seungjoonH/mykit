# NestJS API 규칙

## 규칙
- Controller는 DTO 기반 입력 계약과 응답 코드 매핑만 담당한다.
- ValidationPipe와 ExceptionFilter를 전역 표준으로 유지한다.
- OpenAPI 스키마와 실제 DTO를 동기화한다.

## Do
- `@Body() dto`, `class-validator`, `HttpException` 조합을 일관되게 사용한다.

## Don't
- Controller에서 도메인 판단 로직이나 저장소 접근을 직접 수행하지 않는다.

## 예시
```ts
@Post()
@HttpCode(201)
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

## 경계
- Controller: DTO 계약, 상태코드, 문서화.
- Service: 도메인 규칙 및 오케스트레이션.
- Filter/Interceptor: 에러/응답 공통 포맷.

## 테스트 범위
- DTO validation 실패/성공 케이스를 검증한다.
- ExceptionFilter 에러 응답 포맷을 검증한다.
