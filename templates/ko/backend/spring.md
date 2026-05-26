# Spring 백엔드

## 규칙
- `@RestController`는 요청/응답 계약만 담당한다.
- 입력 검증은 `@Valid` DTO로 강제한다.
- API 예외 응답은 `@ControllerAdvice`로 표준화한다.

## Do
- 트랜잭션/도메인 로직은 서비스 계층에서 처리하고 응답 DTO로 매핑한다.

## Don't
- Controller에서 트랜잭션 스크립트나 repository 호출을 직접 수행하지 않는다.
- 예외 원문 메시지를 클라이언트에 그대로 노출하지 않는다.

## 예시
```java
@PostMapping("/v1/users")
public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
  UserResponse response = usersService.create(request);
  return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

## 경계
- Controller: 매핑, 검증 진입, 상태코드.
- Service: 비즈니스 규칙과 트랜잭션 범위.
- Repository: JPA/쿼리 추상화.
- ControllerAdvice: 공통 API 에러 계약.

## 테스트 범위
- Controller 계약 테스트(검증/상태코드) 검증.
- Service 비즈니스 불변식 검증.
- ControllerAdvice 에러 페이로드 일관성 검증.

## 보안
- 기본 정책은 deny-by-default로 적용하고 필터/시큐리티 체인에서 권한을 선검사한다.
- 인증/인가 실패는 `401/403`으로 표준화한다.
- 시크릿/토큰은 로그 비노출 및 마스킹을 강제한다.

## 중앙 에러 처리
- `@ControllerAdvice`에서 예외를 검출/매핑해 단일 에러 응답 포맷으로 반환한다.
- 서비스 계층은 도메인 예외를 throw하고 컨트롤러는 에러 직렬화를 담당하지 않는다.
- 에러 코드는 공통 상수와 상태코드 매핑으로 중앙 관리한다.

## 테스트 전략
- 버그 수정은 재현 테스트부터 시작한다.
- 컨트롤러/서비스/리포지토리 책임 경계별 테스트를 분리한다.
- 구현 세부에 과결합된 테스트를 지양하고 계약 중심으로 검증한다.
