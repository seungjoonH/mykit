# API 규칙

## 규칙
- API 계약은 버전/스키마 기준으로 안정적으로 유지한다.
- 요청 검증과 응답 포맷은 엔드포인트 경계에서 강제한다.
- 에러 응답 구조를 전 엔드포인트에서 통일한다.

## Do
- DTO/Schema로 입력을 검증하고 명시적 에러 코드를 반환한다.

## Don't
- 엔드포인트마다 다른 에러 포맷/필드명을 사용하지 않는다.

## 예시
```ts
type ApiError = { code: string; message: string };

app.post("/v1/users", validate(createUserSchema), async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json({ data: user });
});

app.use((err, _req, res, _next) => {
  const error: ApiError = normalizeApiError(err);
  res.status(mapStatus(error.code)).json({ error });
});
```

## 경계
- Route/Controller는 검증, 상태코드, 응답 포맷을 담당한다.
- Service는 비즈니스 규칙과 도메인 예외를 담당한다.
- Repository는 영속성 쿼리만 담당한다.

## 테스트 범위
- 계약 테스트: 필수 필드/타입/에러 코드 검증.
- 호환성 테스트: 이전 버전 응답 스키마 유지 검증.
