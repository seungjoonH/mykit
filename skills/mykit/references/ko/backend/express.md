# Express 백엔드

## 적용 범위
- 대상 package가 `express`에 직접 의존하고 Nest나 Next 같은 상위 프레임워크를 쓰지 않을
  때만 이 문서를 적용한다.
- `@nestjs/*`, `next`, `next.config.*`, Nest 애플리케이션 구조가 있으면 Express 레이어 계약
  전체를 건너뛴다.
- monorepo에서는 저장소 전체가 아니라 변경 대상 package를 판별한다.
- `code-refactoring`을 포함해 Express 단독 코드를 생성하거나 수정할 때마다 적용한다.
- 코드 표현과 포맷은 `actions/review-code-style.md`를 먼저 따른다.

## 규칙
- 라우트 핸들러는 계약 중심으로 최소화한다.
- 입력 검증은 라우트 경계의 스키마 미들웨어에서 강제한다.
- 에러 응답은 중앙 `errorHandler`에서 공통 포맷으로 반환한다.
- 의존 방향은 router에서 controller, service, repository 순서로 유지한다.
- Service는 Express와 독립적이어야 하며 `req`, `res`, `next`를 받거나 참조하지 않는다.
- 사용자가 다른 언어를 요구하지 않으면 기본 오류 메시지와 새 오류 메시지는 영어로 쓴다.

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
- Router: URL, HTTP method, 경계 middleware와 controller 연결만 담당한다.
- Controller: HTTP 입력과 출력 변환만 담당한다.
- Service: 검증, 업무 규칙, 권한 판단과 오케스트레이션을 담당한다.
- Repository: 쿼리/영속성 매핑.
- Error middleware: 공통 에러 페이로드.

## 필수 계약
- 예상 가능한 실패는 `ValidationError`, `UnauthorizedError`, `ForbiddenError`,
  `NotFoundError`, `ConflictError` 같은 `AppError` 하위 타입으로 표현한다.
- 성공은 `sendSuccess`를 거쳐 `{ ok: true, data, meta? }`로 반환한다.
- 실패는 `{ ok: false, error: { code, message, details?, requestId } }`로 반환한다.
- `requestContext`로 request ID를 추가하고, `requireLogin`으로 세션 사용자를 `req.user`로
  정규화하고, 등록되지 않은 경로는 `notFoundHandler`로 변환한다.
- 중앙 `errorHandler`는 마지막에 등록한다. 예상하지 못한 오류의 message, stack, SQL 같은
  내부 정보를 클라이언트에 노출하지 않는다.
- 변경 기능에 필요한 레이어만 만든다. placeholder adapter나 사용하지 않는 variant는 만들지
  않되, 해당 기능의 router/controller/service/repository 의미 단위는 닫는다.

## 테스트 범위
- 계약 테스트(`400`, `201`, 에러 포맷) 검증.
- 서비스 계층의 비즈니스 불변식 검증.
- 레포지토리 쿼리 동작 검증.

## 보안
`../security.md` 참고 — Express만의 예외 없이 동일하게 적용한다.

## 중앙 에러 처리
- `errorHandler` 미들웨어에서 모든 에러를 검출/매핑해 단일 응답 포맷으로 반환한다.
- 라우트 핸들러는 `next(error)` 또는 `asyncHandler` 위임으로 중앙 처리 경로를 강제한다.
- 도메인 에러 코드는 `ERROR` 상수와 상태코드 매핑 테이블로 관리한다.

## 테스트 전략
`../testing.md` 참고 — 동일하게 적용한다. 이 스택 고유의 테스트 경계는 위 `테스트 범위`에 이미 정리돼 있다.
