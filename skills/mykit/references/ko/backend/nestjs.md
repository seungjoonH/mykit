# NestJS 백엔드

## 규칙
- Controller는 transport concern만 다룬다.
- Service는 비즈니스 규칙과 오케스트레이션을 담당한다.
- Repository는 영속성 concern만 다룬다.
- ValidationPipe와 ExceptionFilter를 전역 API 계약 표준으로 유지한다.

## Do
- Controller 경계에서 DTO + validation pipe를 적용하고 Service에서 타입 있는 예외를 던진다.
- Swagger/OpenAPI 스펙과 DTO/응답 포맷을 동기화한다.

## Don't
- Controller에 비즈니스 로직이나 쿼리 조합 로직을 직접 넣지 않는다.
- ExceptionFilter를 우회하는 임의 에러 응답을 반환하지 않는다.

## 예시
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

## 경계
- Controller: DTO 바인딩, 상태코드 매핑, 인증 가드 연결을 담당한다.
- Service: 비즈니스 규칙, 트랜잭션, 도메인 예외를 담당한다.
- Repository: ORM/쿼리 빌더 및 영속성 매핑을 담당한다.
- Filter/Interceptor: 공통 에러/응답 계약을 담당한다.

## 테스트 범위
- Controller: 요청 계약/검증/응답 코드를 검증한다.
- Service: 비즈니스 불변식과 실패 시나리오를 검증한다.
- Repository: 쿼리 및 영속성 통합 테스트를 수행한다.
- Filter: 에러 페이로드 표준화 매핑을 검증한다.

## 보안
`../security.md` 참고 — NestJS만의 예외 없이 동일하게 적용한다.

## 중앙 에러 처리
- 전역 `ExceptionFilter`에서 예외를 검출/매핑해 단일 에러 응답 포맷으로 반환한다.
- 서비스 계층은 도메인 예외만 throw하고, 컨트롤러는 에러 포맷 변환을 하지 않는다.
- 에러 코드는 `ERROR` 상수와 HTTP 상태 매핑으로 일관되게 관리한다.

## 테스트 전략
`../testing.md` 참고 — 동일하게 적용한다. 이 스택 고유의 테스트 경계는 위 `테스트 범위`에 이미 정리돼 있다.
