# Add API Endpoint

API endpoint, route handler, controller action, resolver, RPC procedure를 추가할 때 사용한다.

## Project Scan

- API 스타일. REST, RPC, GraphQL, tRPC, server action, route handler.
- framework. Express, NestJS, Spring, Next.js, Fastify 등.
- request validation, DTO/schema, auth, error format, logging 관례.
- service/repository/usecase 계층과 transaction 처리 방식.
- 기존 API 테스트 방식과 fixture/mock 전략.

프로젝트 스타일을 먼저 읽고, 그 스타일에 맞춘 preview를 만든다. REST를 기본값으로 고정하지
않는다.

## Confirmation Policy

새 public contract, request/response schema, auth boundary, error code, transaction이 생기면
확인받는다. 명백한 status typo나 기존 DTO의 누락 import 같은 작은 수정은 바로 진행할 수 있다.

## Confirmation Prompt

```text
이 API를 이런 계약으로 추가하려고 합니다. 괜찮을까요?

Endpoint.
POST /orders

Request.
{
  "items": [{ "productId": "prod_123", "quantity": 2 }],
  "shippingAddressId": "addr_123"
}

Response.
201 Created
{
  "id": "ord_123",
  "status": "pending"
}

Errors.
- 400. request validation 실패.
- 401. 인증 없음.
- 404. 상품 또는 주소 없음.
- 409. 재고 부족.

Implementation boundary.
controller/handler는 contract와 auth만, service/usecase가 비즈니스 로직을 담당합니다.

어떻게 진행할까요?
- 이대로 진행.
- request/response 수정.
- error 정책 수정.
- 더 자세히 보기.
```

## Intake

- API style과 route/procedure name.
- request shape와 validation.
- response shape와 status.
- auth/user context source.
- domain/service boundary.
- transaction과 external dependency.
- error cases와 기존 error format.
- contract, service, integration 테스트 범위.

## Execution

1. 기존 API 파일, DTO/schema, error handler, auth middleware를 읽는다.
2. 프로젝트 관례에 맞춘 contract preview를 제안한다.
3. 승인된 request/response/error contract만 구현한다.
4. validation과 auth boundary를 명확히 둔다.
5. 성공, validation 실패, auth 실패, domain error 중 관련 테스트를 실행한다.
