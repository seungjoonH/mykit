# Next.js 스택

## 규칙
- 라우트 세그먼트는 작고 목적이 분명해야 한다.
- 기본은 Server Component, 필요한 부분만 Client Component로 전환한다.
- 데이터 패칭은 라우트 경계에 가깝게 둔다.
- Route Handler(`route.ts`)는 `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`HEAD`/`OPTIONS` 이름 그대로 export한 함수만 인식된다. 다른 이름은 핸들러로 인식되지 않는다.
- Server Action(`"use server"`)은 mutation 전용이다. 큐에 쌓여 순차 실행되므로 병렬 데이터 조회에 쓰지 않는다.
- 시크릿, service-role 클라이언트, 서버 전용 크리덴셜을 다루는 모듈은 파일 최상단에 `server-only`를 import하고, 같은 파일에서 순수 값/클라이언트 안전 값을 함께 export하지 않는다.
- 순수 로직(타입, 상수, 포맷)과 서버 전용 DB 접근이 한 파일에 섞여 있으면 스타일 문제가 아니라 결함이다. Client Component가 그 파일을 간접적으로라도 import하기 전에 분리한다.

## Do
- 서버 계층에서 무거운 패칭을 수행하고 최소 props만 하위에 전달한다.
- 서버 전용 DB/service-role 접근은 별도 모듈(DAL, Data Access Layer)에 두고 Route Handler나 Server Action이 그 함수만 호출하게 한다. Route Handler나 Server Action 본문에서 `createServiceRoleClient()` 계열을 직접 호출하지 않는다.
- 요청 핸들러마다 리다이렉트/응답 조립을 한 곳(`goTo(path)` 형태의 헬퍼 하나)에 모으고, 분기마다 반복하지 않는다.
- URL 경로 문자열은 파라미터가 최소인 빌더 함수(예: `adminLoginPath()`) 뒤에 두고, 호출부마다 `` `/admin/login?error=${x}` `` 같은 문자열을 직접 조립하지 않는다.
- 도메인 에러는 사람이 읽는 메시지 문자열을 패턴 매칭하는 대신 타입이 있는 식별자(`code: "wrong_org" | "admin" | ...`)로 표현한다.

## Don't
- 작은 위젯 때문에 페이지 전체를 `"use client"`로 만들지 않는다.
- `error.message.includes(...)`로 제어 흐름을 분기하지 않는다. 메시지는 사람이 읽으라고 만든 것이고, 분기는 생산자가 이미 알고 있는 타입 있는 `code`로 한다.
- Client Component가 service-role을 다루는 함수를 함께 export하는 모듈을 import하지 않는다. 컴포넌트가 그 모듈의 무관한 export만 쓰더라도, 모듈 전체가 클라이언트 번들 그래프에 들어간다.
- 같은 엔드포인트에 대한 `fetch("/api/...")` 호출을 여러 컴포넌트에 흩어놓고 컴포넌트마다 에러 처리를 다르게 하지 않는다. 클라이언트 함수 하나로 감싼다.

## 예시
```tsx
// app/users/page.tsx
import { getUsers } from "@/server/users";
import { UserTable } from "./UserTable";

export default async function UsersPage() {
  const users = await getUsers();
  return <UserTable users={users} />;
}
```

```ts
// lib/organizations/get-organization-display.ts (서버 전용 DAL)
import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getOrganizationDisplay(organizationId: string) {
  const db = createServiceRoleClient();
  const { data } = await db.from("organizations").select("*").eq("id", organizationId).single();
  return data;
}
```
```ts
// lib/organizations/organization-locale.ts (클라이언트에서도 안전 — server-only import 없음)
export type OrganizationLocale = { timezone: string; dateFormat: string };
export const DEFAULT_ORGANIZATION_LOCALE: OrganizationLocale = { timezone: "UTC", dateFormat: "MM/dd/yyyy" };
```
```ts
// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { oauthFailurePath } from "@/lib/auth/login-path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const goTo = (path: string) => NextResponse.redirect(new URL(path, url.origin));
  // ...
  if (error) return goTo(oauthFailurePath(ctx, "oauth"));
}
```

## 경계
- Route/Page는 데이터 조합과 화면 구성을 담당한다.
- Client component는 상호작용 UI를 담당한다.
- Server module은 도메인 데이터 접근을 담당한다.
- Route Handler / Server Action은 요청을 파싱하고 DAL 함수 하나를 호출해서 그 결과를 Response나 타입 있는 액션 결과로 매핑한다. 쿼리/SQL을 직접 인라인으로 쓰지 않는다.
- DAL 모듈(`server-only`)은 service-role 클라이언트를 호출하거나 서버 시크릿을 읽는 유일한 곳이다. 순수 함수와 타입은 `server-only`가 없는 형제 모듈에 두고, 같은 파일에 섞지 않는다.
- 경로/리다이렉트 빌더 모듈은 순수 문자열 함수만 두고 프레임워크 의존(`NextResponse`, React)이 전혀 없어야 한다. Route Handler와 Server Component 양쪽에서 쓴다.

## 테스트 범위
- 라우트 렌더링과 metadata를 검증한다.
- 클라이언트 상호작용 동작을 검증한다.
- Route Handler는 요청→응답 계약, 상태 코드, 인가 거부를 검증한다.
- DAL 모듈은 쿼리 형태와 에러 매핑을 검증한다(클라이언트를 mock).
- 경로 빌더 모듈은 mock 없이 순수 단위 테스트로 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다. Client Component가 `server-only` 모듈을 간접적으로 import하는 문제는 빌드에서만 걸리고 타입체크/린트로는 안 잡히므로, 서버/클라이언트 경계를 건드린 세션에서는 최소 한 번 프로덕션 빌드(`next build`)까지 돌려야 한다.

## 보안
`../../security.md` 참고. 규칙은 동일하게 적용된다. 추가로, Client Component에서 도달 가능한 모듈이 `server-only`가 붙은 형제 함수를 같이 export하고 있다면, 실제 번들에서 번들러가 미사용 코드를 제거해줄 수 있더라도 그건 스타일 지적이 아니라 유출로 취급한다. 시크릿을 클라이언트 번들 밖에 두는 걸 트리쉐이킹에 기대지 않는다.
