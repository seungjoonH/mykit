# Express 백엔드

## 적용 범위
- `express`에 직접 의존하고 Nest나 Next를 쓰지 않는 package에만 적용한다.
- `@nestjs/*`, `next`, `next.config.*`, Nest 애플리케이션 구조가 있으면 전체를 건너뛴다.
- Express 단독 코드를 생성, 수정, 리팩토링할 때마다 적용한다.
- 예시 포맷보다 기존 formatter와 code-style 규칙을 우선한다.

## 규칙
- 라우트 핸들러는 계약 중심으로 최소화한다.
- 입력 검증은 라우트 경계의 스키마 미들웨어에서 강제한다.
- 에러 응답은 중앙 `errorHandler`에서 공통 포맷으로 반환한다.
- 의존 방향은 router에서 controller, service, repository 순서로 유지한다.
- Service는 Express request와 response 객체를 알지 못해야 한다.
- 다른 언어를 명시하지 않으면 기본 오류 메시지는 영어로 쓴다.

## Do
- 변경 엔드포인트는 `validate(schema)` + `asyncHandler` 패턴으로 통일한다.
- 비즈니스 로직/영속성 처리는 서비스/레포지토리 계층으로 위임한다.

## Don't
- 라우트마다 임의의 응답/에러 포맷을 만들지 않는다.
- 라우트 파일에서 쿼리 조합과 도메인 판단을 함께 처리하지 않는다.

## 예시
```ts
router.post("/v1/users", validate(createUserSchema), asyncHandler(async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json({ data: user });
}));
```

## 경계
- Router: URL, method, 경계 middleware와 controller 연결만 담당한다.
- Controller: HTTP 입력과 출력 변환만 담당한다.
- Service: 검증, 업무 규칙, 권한 판단과 오케스트레이션을 담당한다.
- Repository: 쿼리/영속성 매핑.
- Error middleware: 공통 에러 페이로드.

## 필수 계약
- 예상 가능한 실패는 `AppError` 하위 타입으로 표현한다.
- 성공은 `sendSuccess`를 거쳐 `{ ok: true, data, meta? }`로 반환한다.
- 실패는 `{ ok: false, error: { code, message, details?, requestId } }`로 반환한다.
- request ID를 추가하고 인증 사용자를 `req.user`로 정규화하며 미등록 경로를 중앙 처리하고
  `errorHandler`를 마지막에 등록한다.
- 예상하지 못한 오류의 내부 정보를 클라이언트에 노출하지 않는다.

## 테스트 범위
- 계약 테스트(`400`, `201`, 에러 포맷) 검증.
- 서비스 계층의 비즈니스 불변식 검증.
- 레포지토리 쿼리 동작 검증.

## 보안
- 기본 정책은 deny-by-default로 적용하고 라우트 가드에서 권한을 먼저 검사한다.
- 인증/인가 실패는 `401/403`으로 일관되게 반환한다.
- 토큰/시크릿은 로그에 노출하지 않는다.

## 중앙 에러 처리
- `errorHandler` 미들웨어에서 모든 에러를 검출/매핑해 단일 응답 포맷으로 반환한다.
- 라우트 핸들러는 `next(error)` 또는 `asyncHandler` 위임으로 중앙 처리 경로를 강제한다.
- 도메인 에러 코드는 `ERROR` 상수와 상태코드 매핑 테이블로 관리한다.

## 테스트 전략
- 버그 수정은 재현 테스트부터 작성한다.
- 핵심 엔드포인트는 성공/실패 경로를 모두 검증한다.
- 구현 디테일 과결합 대신 계약 중심 테스트를 유지한다.
