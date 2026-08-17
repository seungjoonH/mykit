# 에러 처리

## 규칙
- 예측 가능한 에러는 사전에 차단한다.
- 에러를 조용히 삼키지 않는다.
- 에러 코드/메시지는 전역 상수(변수)로 중앙 관리한다.
- 에러 검출/매핑은 중앙 핸들러(필터/미들웨어/어드바이스)로 일원화한다.
- 요청과 실패 처리(파싱, 에러 매핑)가 여러 호출부에서 반복되면 하나의 client 모듈로 통합한다.
- client 모듈을 감쌌다고 끝난 게 아니다. 호출부(컴포넌트, 훅)는 URL, method, header, try/catch를 직접 다루지 않고 도메인 의미를 가진 함수만 호출한다.
- 같은 리소스를 다루는 API 호출 함수는 개별로 흩어두지 않고 하나의 서비스 모듈로 묶어 응집성을 지킨다.
- 같은 원칙이 라우트 핸들러에도 적용된다. 에러 타입에 따라 HTTP 상태/응답을 매핑하는 분기가 여러 핸들러에 반복되면 공용 매핑 함수 하나로 모은다. 한 핸들러 안에서 같은 조건을 상태 코드용, 메시지용으로 두 번 판단하지 않는다.
- 파싱, 검증, 에러 매핑, rollback 같은 처리 흐름이 두 핸들러에 거의 그대로 복사돼 있으면 공통 함수로 추출하고, 서로 다른 부분(호출할 도메인 함수 등)만 인자로 받는다.
- 한 요청이 테이블 여러 개에 걸쳐 순서대로 쓰기 작업을 하면, 중간 단계 실패 시 앞 단계만 되돌리고 이후 단계는 그냥 넘어가지 않는다. 트랜잭션/RPC로 전체를 하나의 단위로 묶거나, 모든 단계에 일관되게 보상 처리를 건다.
- 영역 가드는 layout, 리소스 가드는 domain, API는 반드시 인가한다. 페이지마다 `redirect("/login")`를 하드코딩하지 않는다. 포털마다 같은 화면 파일을 복제하지 않는다.
- API는 기계 에러 코드를 반환한다. 문구는 UI `t()`다. `searchParams`와 본문은 스키마로 파싱한다. `as T`는 쓰지 않는다.

## Do
- 도메인 에러를 명시적으로 throw/return 한다.
- 문자열 리터럴 대신 전역 에러 상수를 사용한다.
- 계층별 에러를 중앙 핸들러에서 공통 응답 포맷으로 변환한다.

## Don't
- 빈 catch 블록을 사용하지 않는다.
- 호출부마다 자체 try/catch와 응답 파싱을 새로 작성하지 않는다.
- 호출부가 client 모듈을 URL, method, header까지 직접 조립해서 부르지 않는다.

## Do 예시
```ts
export const ERROR = {
  INVALID_EVENT_PAYLOAD: "invalid_event_payload",
  AUTH_REQUIRED: "auth_required",
} as const;

try { event = JSON.parse(raw); }
catch { throw new Error(ERROR.INVALID_EVENT_PAYLOAD); }
```

```ts
// ✅ 요청 + 실패 처리를 하나의 client가 소유
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? ERROR.REQUEST_FAILED);
  }
  return res.json();
}

const getUser = (id: string) => request<User>(`/api/users/${id}`);
const updateUser = (id: string, data: UserInput) =>
  request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
```

```ts
// ✅ 도메인 함수로 URL, method, header, 에러 처리를 완전히 은닉
const UserService = {
  get: (id: string) => request<User>(`/api/users/${id}`),
  update: (id: string, data: UserInput) =>
    request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// 호출부는 의도만 남는다
await UserService.update(id, data);
```

## Don't 예시
```ts
try { event = JSON.parse(raw); }
catch { throw new Error("invalid_event_payload"); } // literal 중복 금지
```

```ts
// ❌ 호출부마다 요청과 실패 처리를 반복 구현
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("failed");
  return res.json();
}

async function updateUser(id: string, data: UserInput) {
  const res = await fetch(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("failed"); // 동일한 실패 처리 로직 반복
  return res.json();
}
```

```ts
// ❌ 여전히 부족함. client는 하나로 모았지만 호출부가 URL, method, 에러 처리를 직접 다룬다
try {
  await request(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
} catch (err) {
  setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
}
```

```ts
// ❌ 같은 조건을 메시지용, 상태 코드용으로 두 번 판단
if (!res.ok) {
  return json(
    { message: error instanceof ForbiddenError ? "권한 없음" : "처리 실패" },
    { status: error instanceof ForbiddenError ? 403 : 500 },
  );
}

// ✅ 에러 → 응답 매핑을 하나의 함수로 모은다
function mapErrorToResponse(error: unknown) {
  if (error instanceof ForbiddenError) return { status: 403, message: "권한 없음" };
  return { status: 500, message: "처리 실패" };
}
```

```ts
// ❌ 첫 단계만 실패 시 되돌리고, 이후 단계는 실패해도 그대로 넘어간다
const user = await createAuthUser(input);
try {
  await createProfile(user.id, input);
} catch (error) {
  await deleteAuthUser(user.id); // 여기만 보상 처리
  throw error;
}
await linkClientRecord(user.id); // 실패해도 아무도 되돌리지 않는다

// ✅ 트랜잭션/RPC로 전체를 하나의 단위로 묶는다
await db.rpc("accept_invitation", { input });
```

## 경계
- 경계 계층에서는 transport 에러를 처리한다.
- 도메인 계층에서는 도메인 에러를 처리한다.
- 핸들러 단위의 에러 매핑과 rollback 흐름은 라우트/핸들러 경계에서 한 번만 정의하고 반복 구현하지 않는다.

## 테스트 범위
- 성공/실패 경로를 모두 테스트한다.
- 에러 메시지와 상태 코드 매핑을 검증한다.
