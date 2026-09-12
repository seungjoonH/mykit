# Audit Express Layering

Express 단독 프로젝트의 생성, 수정, 리팩토링에서 레이어 경계를 강제할 때 쓴다.
`code-refactoring` dispatcher가 Express 단독 프로젝트에 호출하며, Express 파일을 새로 만들거나
수정하는 일반 작업에서도 자동 적용한다.

코드 표현은 먼저 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/review-code-style.md`를 따른다.
이 액션의 구조 예시가 프로젝트 formatter나 review-code-style과 충돌하면 review-code-style이
우선한다.

## 적용 판별

루트 `package.json`의 dependencies 또는 devDependencies에 `express`가 있고 다음 상위
프레임워크 신호가 없을 때만 적용한다.

- `@nestjs/`로 시작하는 dependency.
- `next` dependency.
- `next.config.*`.
- Nest CLI 설정이나 Nest module/controller 구조.

상위 프레임워크 신호가 하나라도 있으면 이 액션 전체를 건너뛴다. Nest나 Next의 내부 전송
계층이 Express라는 이유로 적용하지 않는다. monorepo에서는 저장소 전체가 아니라 변경 대상
package 경계에서 판별한다.

## mustHold

- 의존 방향은 `router -> controller -> service -> repository`다.
- Router는 URL, HTTP method, 경계 middleware와 controller 연결만 한다.
- Controller는 HTTP 입력을 service 입력으로 바꾸고 service 결과를 HTTP 응답으로 바꾼다.
- Service는 업무 규칙과 검증을 소유하며 `req`, `res`, `next`를 알지 못한다.
- Repository는 데이터 접근과 영속성 매핑만 소유한다.
- 예상 가능한 실패는 `AppError` 하위 타입으로 던지고 중앙 `errorHandler`가 응답한다.
- 성공 응답은 `sendSuccess`로 `{ ok: true, data, meta? }` 형태를 유지한다.
- 실패 응답은 `{ ok: false, error: { code, message, details?, requestId } }` 형태를 유지한다.
- 기본 오류 메시지와 새 오류 메시지는 영어로 작성한다. 사용자가 다른 언어를 명시한 경우만
  그 언어를 쓴다.
- `requestContext`는 모든 요청에 `requestId`를 부여하고 응답 헤더에도 노출한다.
- `requireLogin`은 세션을 검사한 뒤 정규화한 사용자를 `req.user`에 붙인다.
- 등록되지 않은 경로는 `notFoundHandler`를 거쳐 표준 오류가 된다.

## 기본 구조

프로젝트의 기존 언어, module system, formatter, 데이터 계층 이름을 보존하면서 아래 역할을
닫는다. 기존 코드가 이미 같은 책임을 더 잘 분리했다면 이름을 억지로 바꾸지 않는다.

```text
src/
├── app.js
├── server.js
├── database.js
├── routes/{resource}.routes.js
├── controllers/{resource}.controller.js
├── services/{resource}.service.js
├── repositories/{resource}.repository.js
├── errors/app-error.js
├── middlewares/error-handler.js
├── middlewares/not-found-handler.js
├── middlewares/request-context.js
├── middlewares/require-login.js
└── utils/response.js
```

TypeScript 프로젝트는 같은 역할의 `.ts` 파일을 사용한다. 인증이나 database adapter가 변경
범위에 필요하지 않으면 placeholder 구현을 만들지 않는다. 현재 기능에 필요한 파일만 만들되,
그 기능의 router/controller/service/repository 의미 단위는 닫는다.

## Review Checklist

- 라우터가 검증 규칙, 권한 비교, 쿼리 조합, 파일 저장을 직접 수행하는가.
- 컨트롤러가 업무 분기나 영속성 호출을 직접 수행하는가.
- 서비스가 Express 객체나 HTTP status를 참조하는가.
- 레포지토리가 사용자 메시지나 HTTP 오류를 결정하는가.
- 컨트롤러마다 `try/catch`, 성공 envelope, 오류 envelope를 반복하는가.
- 예상 가능한 오류가 일반 `Error`, `null`, `false`로 의미 없이 전달되는가.
- 404 middleware보다 SPA fallback이 먼저 모든 API 경로를 삼키는가.
- `errorHandler`가 마지막 middleware이며 `res.headersSent`를 처리하는가.
- 예상하지 못한 오류의 내부 message, stack, SQL 정보가 응답에 노출되는가.
- 새 기본 오류 메시지가 영어가 아닌가.
- 단일 statement block, guard clause, 100자 줄 기준이 review-code-style과 맞는가.

## Execution

1. 변경 대상 package에서 Express 단독 프로젝트인지 판별한다. 아니면 즉시 건너뛴다.
2. `review-code-style.md`와 해당 언어의 `references/<언어>/backend/express.md`를 읽는다.
3. 변경 리소스의 route, controller, service, repository와 app middleware 순서를 읽는다.
4. 범위 안 위반을 네 계층과 공통 error/response middleware로 정리한다.
5. 코드 표현은 프로젝트 formatter와 review-code-style에 맞춘다.
6. service 단위 테스트와 API 계약 테스트에서 성공, 검증 실패, 인증, 인가, 부재, 예상하지
   못한 500 경로를 필요한 만큼 검증한다.
7. 관련 lint/typecheck/test 중 가장 작은 검증부터 실행한다.
